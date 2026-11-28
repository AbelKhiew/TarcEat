"use server";
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { readSession } from '@/shared/auth/devSession';
import { getCartAccess, now, requireText } from '@/member-2/internal/rules';
import { priceCart } from '@/member-2/internal/pricing';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function submitOrder(input: T.CheckoutInput): Promise<T.ServiceResult<T.SubmitOrderOutput>> {
  return result(() => serializeMemberTwo(async () => {
    if (!input || typeof input.checkoutRequestId !== 'string' || !/^[\w-]{20,100}$/.test(input.checkoutRequestId))
      throw new RuleError('Invalid checkout request ID.');
    const earlier = (await store.list('orders', { checkoutRequestId: input.checkoutRequestId }))[0];
    if (earlier) {
      const session = await readSession();
      if ((earlier.customerId && earlier.customerId !== session.profileId) ||
          (earlier.customerId === null && session.role !== null)) throw new RuleError('Checkout request already used.');
      return { order: earlier, guestTrackingToken: earlier.customerId ? null : earlier.checkoutRequestId };
    }
    const cart = await getCartAccess(input.cartId);
    const name = requireText(input.contactName, 'Contact name', 100);
    const phone = typeof input.contactPhone === 'string' && /^[+\d\s-]{8,20}$/.test(input.contactPhone.trim()) ? input.contactPhone.trim() : null;
    if (cart.mode !== 'dine_in' && !phone) throw new RuleError('Enter a valid contact phone number.');
    if (cart.mode === 'delivery' && (!input.deliveryAddress || input.deliveryAddress.trim().length < 5 || input.deliveryAddress.length > 300))
      throw new RuleError('Enter a delivery address (5-300 characters).');
    if (cart.mode === 'pickup' && (!input.pickupTime || !/^\d{2}:\d{2}$/.test(input.pickupTime)))
      throw new RuleError('Select a pickup time.');
    if (cart.mode === 'dine_in' && input.paymentMethod !== 'counter') throw new RuleError('Dine-in payment is made at the counter.');
    if (cart.mode !== 'dine_in' && !['online_banking','e_wallet','card'].includes(input.paymentMethod))
      throw new RuleError('Choose a simulated payment method.');
    const priced = await priceCart(cart, input);
    const session = await readSession();
    let visitId: string | null = null;
    if (cart.mode === 'dine_in') {
      const [table] = await store.list('tables', { qrToken: cart.tableToken ?? '' });
      if (!table || table.restaurantId !== cart.restaurantId) throw new RuleError('Invalid table QR code.');
      const [open] = await store.list('visits', { tableId: table.id, status: 'open' });
      if (open) visitId = open.id;
      else {
        const visit = await store.create('visits', { id: randomUUID(), restaurantId: cart.restaurantId,
          tableId: table.id, status: 'open', openedAt: now(), closedAt: null });
        visitId = visit.id;
      }
    }
    const order: T.Order = {
      id: randomUUID(), restaurantId: cart.restaurantId,
      customerId: session.role === 'customer' ? session.profileId : null, visitId,
      checkoutRequestId: input.checkoutRequestId, mode: cart.mode, contactName: name, contactPhone: phone,
      deliveryAddress: cart.mode === 'delivery' ? input.deliveryAddress?.trim() ?? null : null,
      pickupTime: cart.mode === 'pickup' ? input.pickupTime : null,
      ...{ subtotalSen: priced.totals.subtotalSen, discountSen: priced.totals.discountSen,
        taxSen: priced.totals.taxSen, deliveryFeeSen: priced.totals.deliveryFeeSen, totalSen: priced.totals.totalSen },
      voucherId: priced.voucherId, status: 'pending',
      paymentStatus: cart.mode === 'dine_in' ? 'unpaid' : 'paid', paymentMethod: input.paymentMethod,
      cancellationStatus: 'none', cancellationReason: null, createdAt: now(), completedAt: null, archivedAt: null,
    };
    await store.create('orders', order);
    await store.createMany('orderItems', priced.lines.map(line => ({ id: randomUUID(), orderId: order.id,
      itemId: line.item.id, itemName: line.item.name, quantity: line.quantity,
      unitPriceSen: line.item.priceSen, lineTotalSen: line.lineTotalSen, note: line.note })));
    if (cart.mode !== 'dine_in') await store.create('paymentRecords', {
      id: randomUUID(), orderId: order.id, visitId: null, method: input.paymentMethod,
      status: 'paid', isSimulated: true, amountSen: order.totalSen, paidAt: now(), refundedAt: null,
    });
    if (priced.voucherId && order.customerId) {
      await store.create('voucherRedemptions', { id: randomUUID(), voucherId: priced.voucherId,
        customerVoucherId: priced.customerVoucherId, customerId: order.customerId,
        orderId: order.id, redeemedAt: now(), reversedAt: null });
      if (priced.customerVoucherId) {
        const claim = await store.get('customerVouchers', priced.customerVoucherId);
        if (claim) await store.update('customerVouchers', claim.id,
          { usesCount: claim.usesCount + 1, status: claim.usesCount + 1 >= claim.useLimit ? 'exhausted' : 'usable' });
      }
    }
    await store.update('carts', cart.id, { lines: [], updatedAt: now() });
    return { order, guestTrackingToken: order.customerId ? null : order.checkoutRequestId };
  }));
}
