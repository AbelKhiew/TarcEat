'use server';
import { store } from '@/shared/storage';
import { requireRole, result } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function listPendingApplications(): Promise<T.ServiceResult<T.RestaurantApplication[]>> {
  return result(async () => {
    await requireRole('root_admin');
    return store.list('restaurantApplications', { status: 'pending' });
  });
}
