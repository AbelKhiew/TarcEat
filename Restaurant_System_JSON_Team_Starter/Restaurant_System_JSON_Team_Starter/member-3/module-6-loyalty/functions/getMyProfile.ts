'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, requireRole, RuleError } from '@/shared/auth/permissions';
import { publicProfile } from '../internal/profile';

export async function getMyProfile(): Promise<T.ServiceResult<T.Profile>> {
  return result(async () => {
    const id = await requireRole('customer');
    const profile = await store.get('profiles', id);
    if (!profile?.isActive) throw new RuleError('Customer account is unavailable.');
    return publicProfile(profile);
  });
}