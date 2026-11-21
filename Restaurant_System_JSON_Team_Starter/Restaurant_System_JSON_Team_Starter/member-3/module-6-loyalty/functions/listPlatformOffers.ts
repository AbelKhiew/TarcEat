'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, requireRole } from '@/shared/auth/permissions';

export async function listPlatformOffers(): Promise<T.ServiceResult<T.Voucher[]>> {
  return result(async () => {
    await requireRole('customer');
    const offers = await store.list('vouchers', { restaurantId: null, claimEnabled: true, isUsable: true });
    return offers.filter(voucher => !voucher.archivedAt && Date.parse(voucher.expiresAt) > Date.now());
  });
}