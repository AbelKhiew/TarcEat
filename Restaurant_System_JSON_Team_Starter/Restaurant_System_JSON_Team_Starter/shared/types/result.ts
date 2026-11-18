export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

/** EMPTY SCAFFOLD ONLY. T documents the intended future success data.
 * Promise<void> permits truly empty async bodies without fake results or throws.
 * Implemented functions must use Promise<ServiceResult<T>> and follow shared/contracts/.
 * Awaiting a stub gives undefined, never a successful operation.
 */
export type StubResult<T> = Promise<void>;
