'use server';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { requireRole, result, RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function deleteRejectedApplication(applicationId: T.ID): Promise<T.ServiceResult<null>> {
  return result(() => serializeChanges(async () => {
    const ownerId = await requireRole('owner');
    const application = await store.get('restaurantApplications', applicationId);
    if (application?.applicantOwnerId !== ownerId || application.status !== 'rejected') {
      throw new RuleError('Only your rejected applications can be deleted.');
    }
    await store.remove('restaurantApplications', applicationId);
    return null;
  }));
}
