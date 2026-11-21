'use server';
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { result, RuleError } from '@/shared/auth/permissions';
import { hashPassword } from '@/shared/auth/devSession';
import { field, phone } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function registerOwner(input: T.RegisterAccountInput): Promise<T.ServiceResult<T.Profile>> {
  return result(() => serializeChanges(async () => {
    const email = field(input?.email, 'Email', 3, 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new RuleError('Enter a valid email address.');
    const password = input.password;
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      throw new RuleError('Password must have 8 to 128 characters.');
    }
    if ((await store.list('profiles', { email, role: 'owner' })).length) throw new RuleError('An owner account already uses that email.');
    const profile: T.Profile = {
      id: randomUUID(), fullName: field(input.fullName, 'Full name', 2, 100), email,
      phone: phone(input.phone), address: null, role: 'owner', isActive: true,
      createdAt: new Date().toISOString(),
    };
    await store.create('profiles', { ...profile, passwordHash: hashPassword(password) });
    return profile;
  }));
}
