import 'server-only';
import { readSession } from './devSession';
import { store } from '@/shared/storage';
import type { Role, ServiceResult } from '@/shared/types';

export class RuleError extends Error {}

export async function requireRole(role: Role) {
  const session = await readSession();
  if (session.role !== role || !session.profileId) throw new RuleError('Sign in with the required account.');
  return session.profileId;
}

export async function ownedRestaurant(restaurantId: string) {
  const ownerId = await requireRole('owner');
  const restaurant = await store.get('restaurants', restaurantId);
  if (!restaurant || restaurant.ownerId !== ownerId) throw new RuleError('Restaurant access denied.');
  return restaurant;
}

export async function result<T>(work: () => Promise<T>): Promise<ServiceResult<T>> {
  try {
    return { ok: true, data: await work() };
  } catch (error) {
    if (error instanceof RuleError) return { ok: false, error: { code: 'RULE', message: error.message } };
    console.error(error);
    return { ok: false, error: { code: 'STORAGE', message: 'The operation could not be saved or loaded. Please retry.' } };
  }
}
