import { useCallback } from 'react'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: 'prefix-$' | 'suffix-%' | 'suffix-d' | 'none'
  onChange: (v: number) => void
  accentColor?: string
  description?: string
}

function formatValue(value: number, unit: Props['unit']): string {
  if (unit === 'prefix-$') return `$${value.toFixed(value < 10 ? 2 : 1)}`
  if (unit === 'suffix-%') return `${value.toFixed(1)}%`
  if (unit === 'suffix-d') return `${Math.round(value)}d`
  return `${value}`
}

export default function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  accentColor = '#00e5a0',
  description,
}: Props) {
  const pct = ((value - min) / (max - min)) * 100

  const trackStyle = {
    background: `linear-gradient(to right, ${accentColor} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value))
    },
    [onChange],
  )

  return (
    <div className="group mb-5">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="label-mono text-xs">{label}</span>
          {description && (
            <p className="text-xs text-muted mt-0.5 hidden group-hover:block transition-all">
              {description}
            </p>
          )}
        </div>
        <span
          className="value-mono text-sm tabular-nums"
          style={{ color: accentColor }}
        >
          {formatValue(value, unit)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={trackStyle}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted mt-1 font-mono">
        <span>{formatValue(min, unit)}</span>
        <span>{formatValue(max, unit)}</span>
      </div>
    </div>
  )
}
