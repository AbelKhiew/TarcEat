import 'server-only';
import { store } from '@/shared/storage';
import { RuleError } from '@/shared/auth/permissions';
import { readSession } from '@/shared/auth/devSession';
import type * as T from '@/shared/types';
import { eligibleRestaurant, requireQuantity, validateNote } from './rules';

/** Read prices from the current menu, not from the browser. */
export async function priceCart(cart: T.Cart, input?: T.CheckoutInput) {
  const restaurant = await eligibleRestaurant(cart.restaurantId);
  if (!cart.lines.length) throw new RuleError('Your cart is empty.');
  let subtotalSen = 0;
  const lines: { item: T.MenuItem; quantity: number; note: string; lineTotalSen: number }[] = [];
  for (const line of cart.lines) {
    const item = await store.get('menuItems', line.itemId);
    if (!item || item.restaurantId !== cart.restaurantId || item.archivedAt || !item.isAvailable)
      throw new RuleError('One of your selected items is unavailable. Please update the cart.');
    const quantity = requireQuantity(line.quantity);
    const lineTotalSen = item.priceSen * quantity;
    if (!Number.isSafeInteger(lineTotalSen) || lineTotalSen < 0) throw new RuleError('Invalid price.');
    subtotalSen += lineTotalSen;
    lines.push({ item, quantity, note: validateNote(line.note), lineTotalSen });
  }
  let discountSen = 0;
  let voucherId: string | null = null;
  let customerVoucherId: string | null = null;
  if (input?.voucherCode?.trim() || input?.customerVoucherId) {
    const session = await readSession();
    if (session.role !== 'customer' || !session.profileId) throw new RuleError('Sign in as a customer before using a voucher.');
    if (input.voucherCode?.trim() && input.customerVoucherId) throw new RuleError('Use only one voucher per order.');
    let voucher: T.Voucher | null = null;
    if (input.customerVoucherId) {
      const claim = await store.get('customerVouchers', input.customerVoucherId);
      if (!claim || claim.customerId !== session.profileId || claim.status !== 'usable' || claim.usesCount >= claim.useLimit)
        throw new RuleError('This voucher claim is no longer available.');
      customerVoucherId = claim.id;
      voucher = await store.get('vouchers', claim.voucherId);
    } else {
      const code = input.voucherCode!.trim().toUpperCase();
      voucher = (await store.list('vouchers')).find(v => v.code === code && v.restaurantId === cart.restaurantId) ?? null;
    }
    if (!voucher || voucher.archivedAt || !voucher.isUsable || Date.parse(voucher.expiresAt) <= Date.now() ||
      (voucher.restaurantId && voucher.restaurantId !== cart.restaurantId) || subtotalSen < voucher.minimumSpendSen)
      throw new RuleError('Voucher is invalid, expired or minimum spend is not reached.');
    const uses = (await store.list('voucherRedemptions', { voucherId: voucher.id })).filter(v => !v.reversedAt);
    if (voucher.totalUseLimit !== null && uses.length >= voucher.totalUseLimit) throw new RuleError('Voucher usage limit reached.');
    if (voucher.perCustomerUseLimit !== null && uses.filter(v => v.customerId === session.profileId).length >= voucher.perCustomerUseLimit)
      throw new RuleError('You have reached the voucher use limit.');
    voucherId = voucher.id;
    discountSen = Math.min(subtotalSen, voucher.discountSen);
  }
  const taxSen = Math.round((subtotalSen - discountSen) * restaurant.taxRateBps / 10000);
  const deliveryFeeSen = cart.mode === 'delivery' ? restaurant.deliveryFeeSen : 0;
  return {
    totals: { subtotalSen, discountSen, taxSen, deliveryFeeSen, totalSen: subtotalSen - discountSen + taxSen + deliveryFeeSen } satisfies T.CheckoutPreview,
    lines, voucherId, customerVoucherId,
  };
}
