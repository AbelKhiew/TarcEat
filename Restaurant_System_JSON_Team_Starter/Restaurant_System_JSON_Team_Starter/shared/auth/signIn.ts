'use server';
import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { saveSession, matchesPassword } from './devSession';
import { result, RuleError } from './permissions';

export async function signIn(input: T.SignInInput): Promise<T.ServiceResult<T.SessionContext>> {
  return result(async () => {
    if (typeof input?.email !== 'string' || typeof input.password !== 'string' || input.password.length > 128) {
      throw new RuleError('Enter a valid email and password.');
    }
    const [profile] = await store.list('profiles', { email: input.email.trim().toLowerCase(), role: input.accountType });
    const seeded = ['admin-001', 'owner-001', 'owner-002'].includes(profile?.id ?? '');
    const valid = profile?.passwordHash ? matchesPassword(input.password, profile.passwordHash)
      : process.env.NODE_ENV === 'development' && seeded && input.password === 'Demo12345';
    if (!profile?.isActive || !valid) throw new RuleError('Email, password or account type is incorrect.');
    const session = { profileId: profile.id, role: profile.role, selectedRestaurantId: null };
    await saveSession(session);
    return session;
  });
}
