import 'server-only';
import { cookies } from 'next/headers';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { store } from '@/shared/storage';
import type { SessionContext } from '@/shared/types';

const state = globalThis as typeof globalThis & { restaurantSessionKey?: Buffer };
const key = state.restaurantSessionKey ??= randomBytes(32);
const cookie = 'restaurant_dev_session';
const guest: SessionContext = { profileId: null, role: null, selectedRestaurantId: null };

function signature(payload: string) {
  return createHmac('sha256', key).update(payload).digest('base64url');
}

export async function readSession(): Promise<SessionContext> {
  const raw = (await cookies()).get(cookie)?.value ?? '';
  const [payload, mac, extra] = raw.split('.');
  if (!payload || !mac || extra !== undefined) return guest;
  const expected = Buffer.from(signature(payload));
  const actual = Buffer.from(mac);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return guest;
  const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
  const profile = await store.get('profiles', session.profileId);
  if (!profile?.isActive) return guest;
  return { profileId: profile.id, role: profile.role, selectedRestaurantId: session.selectedRestaurantId ?? null };
}

export async function saveSession(session: SessionContext) {
  const jar = await cookies();
  if (!session.profileId) {
    jar.delete(cookie);
    return;
  }
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  jar.set(cookie, payload + '.' + signature(payload), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 28800 });
}

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  return salt + ':' + scryptSync(password, salt, 64).toString('hex');
}

export function matchesPassword(password: string, hash: string) {
  const [salt, digest] = hash.split(':');
  if (!salt || !digest || password.length > 128) return false;
  const expected = Buffer.from(digest, 'hex');
  const actual = Buffer.from(hashPassword(password, salt).split(':')[1], 'hex');
  return actual.length === expected.length && timingSafeEqual(expected, actual);
}
