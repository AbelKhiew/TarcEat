'use server';
import { store } from '@/shared/storage';
import { requireRole, result } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function listMyApplications(): Promise<T.ServiceResult<T.RestaurantApplication[]>> {
  return result(async () => {
    return store.list('restaurantApplications', { applicantOwnerId: await requireRole('owner') });
  });
}
