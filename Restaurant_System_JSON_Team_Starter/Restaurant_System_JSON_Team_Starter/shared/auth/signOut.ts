'use server';
import type * as T from '@/shared/types';
import { saveSession } from './devSession';
import { result } from './permissions';

export async function signOut(): Promise<T.ServiceResult<null>> {
  return result(async () => {
    await saveSession({ profileId: null, role: null, selectedRestaurantId: null });
    return null;
  });
}
