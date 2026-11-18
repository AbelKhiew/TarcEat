export default function Field({ label, name, type = 'text', value, required = true, min, max }: {
  label: string; name: string; type?: string; value?: string | number; required?: boolean; min?: number; max?: number;
}) {
  return <label>{label}<input className="field" name={name} type={type} defaultValue={value} required={required} min={min} max={max} /></label>;
}
