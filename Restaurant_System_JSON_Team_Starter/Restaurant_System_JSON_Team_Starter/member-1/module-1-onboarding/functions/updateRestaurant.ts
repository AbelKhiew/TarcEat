'use server';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { ownedRestaurant, result, RuleError } from '@/shared/auth/permissions';
import { field, phone, integer } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function updateRestaurant(restaurantId: T.ID, input: T.RestaurantUpdateInput): Promise<T.ServiceResult<T.Restaurant>> {
  return result(() => serializeChanges(async () => {
    const current = await ownedRestaurant(restaurantId);
    if (current.status === 'archived') throw new RuleError('Archived restaurants cannot be edited.');
    if (typeof input?.isOpen !== 'boolean') throw new RuleError('Choose an operating status.');
    return store.update('restaurants', restaurantId, {
      name: field(input.name, 'Restaurant name', 2, 120), address: field(input.address, 'Address', 5, 250),
      phone: phone(input.phone), bio: field(input.bio, 'Description', 0, 500), isOpen: input.isOpen,
      taxRateBps: integer(input.taxRateBps, 'Tax basis points', 0, 10000),
      deliveryFeeSen: integer(input.deliveryFeeSen, 'Delivery fee in sen', 0, 100000),
    });
  }));
}
