'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, requireRole } from '@/shared/auth/permissions';
import { saveSession } from '@/shared/auth/devSession';

export async function deactivateMyProfile(): Promise<T.ServiceResult<null>> {
  return result(async () => {
    const id = await requireRole('customer');
    await store.update('profiles', id, { isActive: false });
    await saveSession({ profileId: null, role: null, selectedRestaurantId: null });
    return null;
  });
}
