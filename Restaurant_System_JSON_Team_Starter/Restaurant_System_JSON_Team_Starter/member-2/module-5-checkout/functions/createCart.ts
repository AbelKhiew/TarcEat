"use server";
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { readSession } from '@/shared/auth/devSession';
import { eligibleRestaurant, now } from '@/member-2/internal/rules';
import type * as T from '@/shared/types';
export async function createCart(input: T.CartInput): Promise<T.ServiceResult<T.Cart>> {
  return result(async () => {
    if (!input || !['dine_in', 'pickup', 'delivery'].includes(input.mode) || typeof input.restaurantId !== 'string')
      throw new RuleError('Select a restaurant and order method.');
    await eligibleRestaurant(input.restaurantId);
    if (input.mode === 'dine_in') {
      const [table] = await store.list('tables', { qrToken: input.tableToken ?? '' });
      if (!table || table.restaurantId !== input.restaurantId) throw new RuleError('Scan a valid table QR code first.');
    }
    const session = await readSession();
    if (session.role === 'owner' || session.role === 'root_admin') throw new RuleError('Use guest checkout or a customer account.');
    return store.create('carts', { id: randomUUID(), customerId: session.role === 'customer' ? session.profileId : null,
      restaurantId: input.restaurantId, mode: input.mode, tableToken: input.mode === 'dine_in' ? input.tableToken : null,
      lines: [], updatedAt: now() });
  });
}
