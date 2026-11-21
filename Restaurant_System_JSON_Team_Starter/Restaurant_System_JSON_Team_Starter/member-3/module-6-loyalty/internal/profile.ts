import 'server-only';
import type { Profile, ProfileUpdateInput } from '@/shared/types';
import { RuleError } from '@/shared/auth/permissions';

const state = globalThis as typeof globalThis & { customerRegistrationQueue?: Promise<unknown> };

export function serializeRegistration<T>(work: () => Promise<T>): Promise<T> {
  const next = (state.customerRegistrationQueue ?? Promise.resolve()).then(work);
  state.customerRegistrationQueue = next.then(() => undefined, () => undefined);
  return next;
}

export function publicProfile(profile: Profile & { passwordHash?: string }): Profile {
  const { passwordHash, ...safeProfile } = profile;
  return safeProfile;
}

export function validateDetails(input: ProfileUpdateInput): ProfileUpdateInput {
  const fullName = typeof input?.fullName === 'string' ? input.fullName.trim() : '';
  const phone = typeof input?.phone === 'string' ? input.phone.trim() : '';
  if (!fullName || fullName.length > 120) throw new RuleError('Enter a full name up to 120 characters.');
  if (!/^\+?[\d -]{7,20}$/.test(phone) || phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15) {
    throw new RuleError('Enter a valid phone number.');
  }
  if (input.address !== null && (typeof input.address !== 'string' || input.address.length > 500)) {
    throw new RuleError('Enter an address up to 500 characters.');
  }
  return { fullName, phone, address: input.address?.trim() || null };
}
