'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, requireRole } from '@/shared/auth/permissions';

export async function listMyVouchers(): Promise<T.ServiceResult<T.CustomerVoucher[]>> {
  return result(async () => {
    const customerId = await requireRole('customer');
    const claims = await store.list('customerVouchers', { customerId });
    return Promise.all(claims.map(async claim => {
      const voucher = await store.get('vouchers', claim.voucherId);
      if (!voucher?.isUsable) return { ...claim, status: 'disabled' };
      if (Date.parse(voucher.expiresAt) <= Date.now()) return { ...claim, status: 'expired' };
      if (claim.usesCount >= claim.useLimit) return { ...claim, status: 'exhausted' };
      return claim;
    }));
  });
}
