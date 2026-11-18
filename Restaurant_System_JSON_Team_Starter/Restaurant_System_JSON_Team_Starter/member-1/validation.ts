import 'server-only';
import { RuleError } from '@/shared/auth/permissions';

export function field(value: unknown, label: string, min: number, max: number) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    throw new RuleError(`${label} must have ${min} to ${max} characters.`);
  }
  return value.trim();
}

export function phone(value: unknown) {
  const number = field(value, 'Phone', 8, 20);
  if (!/^\+?[0-9][0-9 -]+$/.test(number) || number.replace(/\D/g, '').length < 8) {
    throw new RuleError('Enter a valid phone number.');
  }
  return number;
}

export function integer(value: unknown, label: string, min: number, max: number) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw new RuleError(`${label} must be a whole number from ${min} to ${max}.`);
  }
  return value;
}
