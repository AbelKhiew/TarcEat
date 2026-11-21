'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { serializeVoucherChange, validateVoucher, voucherManager } from '../internal/vouchers';

export async function updateVoucher(voucherId: T.ID, input: T.VoucherInput): Promise<T.ServiceResult<T.Voucher>> {
  return result(async () => {
    return serializeVoucherChange(async () => {
      const voucher = await store.get('vouchers', voucherId);
      if (!voucher) throw new RuleError('Voucher was not found.');
      await voucherManager(voucher.restaurantId);
      if (input?.restaurantId !== voucher.restaurantId) throw new RuleError('Voucher scope cannot be changed.');
      return store.update('vouchers', voucherId, await validateVoucher(input, voucher.id));
    });
  });
}
