'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { voucherManager } from '../internal/vouchers';

export async function listManagedVouchers(restaurantId: T.ID | null): Promise<T.ServiceResult<T.Voucher[]>> {
  return result(async () => {
    await voucherManager(restaurantId);
    return store.list('vouchers', { restaurantId });
  });
}
