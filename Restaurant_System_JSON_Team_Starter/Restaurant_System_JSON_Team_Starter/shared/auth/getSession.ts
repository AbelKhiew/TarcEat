'use server';
import type * as T from '@/shared/types';
import { readSession } from './devSession';
import { result } from './permissions';

export async function getSession(): Promise<T.ServiceResult<T.SessionContext>> {
  return result(readSession);
}
