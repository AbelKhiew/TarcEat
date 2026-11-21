'use server';

import { requireRole, result, RuleError } from '@/shared/auth/permissions';
import type { ServiceResult } from '@/shared/types';

export async function previewMenuImage(file: File): Promise<ServiceResult<string>> {
  return result(async () => {
    await requireRole('owner');
    if (!(file instanceof File) || file.size === 0 || file.size > 512 * 1024 ||
        !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      throw new RuleError('Choose a PNG, JPEG or WebP image up to 512 KB.');
    }
    return 'data:' + file.type + ';base64,' + Buffer.from(await file.arrayBuffer()).toString('base64');
  });
}