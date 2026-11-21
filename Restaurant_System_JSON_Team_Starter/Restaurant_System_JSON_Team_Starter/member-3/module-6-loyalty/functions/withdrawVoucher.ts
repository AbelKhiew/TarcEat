'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { serializeVoucherChange, voucherManager } from '../internal/vouchers';

export async function withdrawVoucher(voucherId: T.ID): Promise<T.ServiceResult<T.Voucher>> {
  return result(async () => {
    return serializeVoucherChange(async () => {
      const voucher = await store.get('vouchers', voucherId);
      if (!voucher) throw new RuleError('Voucher was not found.');
      await voucherManager(voucher.restaurantId);
      return store.update('vouchers', voucherId, { claimEnabled: false });
    });
  });
}
