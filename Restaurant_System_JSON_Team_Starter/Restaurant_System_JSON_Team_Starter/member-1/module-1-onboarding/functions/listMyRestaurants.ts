'use server';
import { store } from '@/shared/storage';
import { requireRole, result } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function listMyRestaurants(): Promise<T.ServiceResult<T.Restaurant[]>> {
  return result(async () => {
    return store.list('restaurants', { ownerId: await requireRole('owner') });
  });
}
