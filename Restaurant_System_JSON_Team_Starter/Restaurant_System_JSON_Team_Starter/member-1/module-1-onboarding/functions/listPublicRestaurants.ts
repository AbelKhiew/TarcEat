'use server';
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function listPublicRestaurants(): Promise<T.ServiceResult<T.Restaurant[]>> {
  return result(async () => {
    return store.list('restaurants', { status: 'active' });
  });
}
