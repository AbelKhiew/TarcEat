'use server';
import type * as T from '@/shared/types';
import { saveSession } from './devSession';
import { result, ownedRestaurant } from './permissions';

export async function selectRestaurant(restaurantId: string): Promise<T.ServiceResult<T.SessionContext>> {
  return result(async () => {
    const restaurant = await ownedRestaurant(restaurantId);
    const session = { profileId: restaurant.ownerId, role: 'owner' as const, selectedRestaurantId: restaurant.id };
    await saveSession(session);
    return session;
  });
}
