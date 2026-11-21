import 'server-only';
import type { ID, VoucherInput } from '@/shared/types';
import { ownedRestaurant, requireRole, RuleError } from '@/shared/auth/permissions';
import { store } from '@/shared/storage';

const state = globalThis as typeof globalThis & { voucherChangeQueue?: Promise<unknown> };

export function serializeVoucherChange<T>(work: () => Promise<T>): Promise<T> {
  const next = (state.voucherChangeQueue ?? Promise.resolve()).then(work);
  state.voucherChangeQueue = next.then(() => undefined, () => undefined);
  return next;
}

export async function voucherManager(restaurantId: ID | null) {
  if (restaurantId === null) return requireRole('root_admin');
  return (await ownedRestaurant(restaurantId)).ownerId;
}

export async function validateVoucher(input: VoucherInput, currentId?: ID): Promise<VoucherInput> {
  if (!input || (input.restaurantId !== null && typeof input.restaurantId !== 'string')) {
    throw new RuleError('Choose a voucher scope.');
  }
  await voucherManager(input.restaurantId);
  const code = typeof input.code === 'string' ? input.code.trim().toUpperCase() : '';
  if (!/^[A-Z0-9_-]{2,30}$/.test(code)) throw new RuleError('Use 2 to 30 letters, numbers, hyphens or underscores for the code.');
  const integers = [input.discountSen, input.minimumSpendSen, input.pointsCost, input.usesPerClaim];
  if (!integers.every(value => Number.isSafeInteger(value) && value >= 0) || !input.discountSen || !input.usesPerClaim) {
    throw new RuleError('Enter a positive discount and uses per claim, and non-negative spend and points.');
  }
  if (![input.totalUseLimit, input.perCustomerUseLimit].every(value => value === null || (Number.isSafeInteger(value) && value > 0))) {
    throw new RuleError('Use positive whole numbers for limits or leave them blank.');
  }
  if (typeof input.expiresAt !== 'string' || !Number.isFinite(Date.parse(input.expiresAt)) ||
      typeof input.claimEnabled !== 'boolean' || typeof input.isUsable !== 'boolean') {
    throw new RuleError('Enter a valid expiration date and voucher settings.');
  }
  const matches = await store.list('vouchers', { restaurantId: input.restaurantId, code });
  if (matches.some(voucher => voucher.id !== currentId)) throw new RuleError('This code already exists in this scope.');
  return { restaurantId: input.restaurantId, code, discountSen: input.discountSen, minimumSpendSen: input.minimumSpendSen,
    pointsCost: input.pointsCost, expiresAt: new Date(input.expiresAt).toISOString(), claimEnabled: input.claimEnabled,
    isUsable: input.isUsable, totalUseLimit: input.totalUseLimit, perCustomerUseLimit: input.perCustomerUseLimit,
    usesPerClaim: input.usesPerClaim };
}