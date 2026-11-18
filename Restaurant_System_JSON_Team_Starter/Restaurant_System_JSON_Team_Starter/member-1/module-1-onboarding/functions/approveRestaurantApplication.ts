'use server';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { requireRole, result, RuleError } from '@/shared/auth/permissions';
import { phone } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function approveRestaurantApplication(applicationId: T.ID): Promise<T.ServiceResult<T.Restaurant>> {
  return result(() => serializeChanges(async () => {
    const reviewedBy = await requireRole('root_admin');
    const application = await store.get('restaurantApplications', applicationId);
    if (!application || application.status === 'rejected') throw new RuleError('Application cannot be approved.');
    const id = application.approvedRestaurantId ?? 'approved-' + application.id;
    const existing = await store.get('restaurants', id);
    if (application.status === 'approved') {
      if (!existing) throw new RuleError('The approved restaurant record is missing.');
      return existing;
    }
    const owner = await store.get('profiles', application.applicantOwnerId);
    if (!owner?.isActive || owner.role !== 'owner') throw new RuleError('Applicant owner account is unavailable.');
    const restaurant = existing ?? await store.create('restaurants', {
      id, ownerId: owner.id, name: application.restaurantName, address: application.address,
      phone: application.contactPhone, bio: application.bio, status: 'active', isOpen: false,
      taxRateBps: 0, deliveryFeeSen: 0, createdAt: new Date().toISOString(),
    });
    await store.update('restaurantApplications', applicationId, {
      status: 'approved', approvedRestaurantId: id, reviewedBy, reviewedAt: new Date().toISOString(),
    });
    return restaurant;
  }));
}
