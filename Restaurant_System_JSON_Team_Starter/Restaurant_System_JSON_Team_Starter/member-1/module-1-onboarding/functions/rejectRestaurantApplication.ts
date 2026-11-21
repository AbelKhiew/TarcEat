'use server';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { requireRole, result, RuleError } from '@/shared/auth/permissions';
import { field } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function rejectRestaurantApplication(applicationId: T.ID, reason: string): Promise<T.ServiceResult<T.RestaurantApplication>> {
  return result(() => serializeChanges(async () => {
    const reviewedBy = await requireRole('root_admin');
    const application = await store.get('restaurantApplications', applicationId);
    if (application?.status !== 'pending' || await store.get('restaurants', 'approved-' + applicationId)) {
      throw new RuleError('Only a pending application can be rejected.');
    }
    return store.update('restaurantApplications', applicationId, {
      status: 'rejected', reviewReason: field(reason, 'Reason', 1, 500), reviewedBy, reviewedAt: new Date().toISOString(),
    });
  }));
}
