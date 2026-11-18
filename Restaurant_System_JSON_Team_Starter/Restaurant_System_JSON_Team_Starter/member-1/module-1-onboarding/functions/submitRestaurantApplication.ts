'use server';
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { requireRole, result } from '@/shared/auth/permissions';
import { field, phone } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function submitRestaurantApplication(input: T.RestaurantApplicationInput): Promise<T.ServiceResult<T.RestaurantApplication>> {
  return result(() => serializeChanges(async () => {
    const applicantOwnerId = await requireRole('owner');
    return store.create('restaurantApplications', {
      id: randomUUID(), applicantOwnerId, restaurantName: field(input?.restaurantName, 'Restaurant name', 2, 120),
      address: field(input.address, 'Address', 5, 250), contactPhone: phone(input.contactPhone),
      bio: field(input.bio, 'Description', 0, 500), status: 'pending', approvedRestaurantId: null,
      reviewReason: null, reviewedBy: null, reviewedAt: null, createdAt: new Date().toISOString(),
    });
  }));
}
