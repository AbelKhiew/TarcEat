'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { hashPassword } from '@/shared/auth/devSession';
import { randomUUID } from 'node:crypto';
import { serializeRegistration, validateDetails } from '../internal/profile';

export async function registerCustomer(input: T.RegisterAccountInput): Promise<T.ServiceResult<T.Profile>> {
  return result(async () => {
    return serializeRegistration(async () => {
      const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new RuleError('Enter a valid email.');
      if (typeof input.password !== 'string' || input.password.length < 8 || input.password.length > 128) {
        throw new RuleError('Use a password between 8 and 128 characters.');
      }
      const details = validateDetails({ fullName: input.fullName, phone: input.phone, address: null });
      if ((await store.list('profiles', { email })).length) throw new RuleError('This email already has an account.');
      const id = randomUUID();
      const profile: T.Profile = { ...details, id, email, role: 'customer', isActive: true, createdAt: new Date().toISOString() };
      const passwordHash = hashPassword(input.password);
      const account = await store.create('loyaltyAccounts', { id, customerId: id, pointsBalance: 0 });
      try {
        await store.create('profiles', { ...profile, passwordHash });
      } catch (error) {
        await store.remove('loyaltyAccounts', account.id);
        throw error;
      }
      return profile;
    });
  });
}