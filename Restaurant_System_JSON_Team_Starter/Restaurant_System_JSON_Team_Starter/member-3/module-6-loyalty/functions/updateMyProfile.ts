'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, requireRole } from '@/shared/auth/permissions';
import { publicProfile, validateDetails } from '../internal/profile';

export async function updateMyProfile(input: T.ProfileUpdateInput): Promise<T.ServiceResult<T.Profile>> {
  return result(async () => {
    const id = await requireRole('customer');
    return publicProfile(await store.update('profiles', id, validateDetails(input)));
  });
}
