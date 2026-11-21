'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { randomUUID } from 'node:crypto';
import { serializeVoucherChange, validateVoucher, voucherManager } from '../internal/vouchers';

export async function createVoucher(input: T.VoucherInput): Promise<T.ServiceResult<T.Voucher>> {
  return result(async () => {
    return serializeVoucherChange(async () => {
      const voucher = await validateVoucher(input);
      const createdBy = await voucherManager(voucher.restaurantId);
      return store.create('vouchers', { ...voucher, id: randomUUID(), createdBy, archivedAt: null });
    });
  });
}