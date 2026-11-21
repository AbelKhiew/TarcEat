'use client';

export default function AvailabilityToggle({ isAvailable, disabled, toggle }: {
  isAvailable: boolean;
  disabled: boolean;
  toggle: () => void;
}) {
  return <button type="button" className="button-secondary" disabled={disabled} onClick={toggle}>
    {isAvailable ? 'Mark sold out' : 'Make available'}
  </button>;
}
