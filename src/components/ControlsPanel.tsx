import SliderControl from './SliderControl'
import type { OptionInputs } from '../types'

interface Props {
  inputs: OptionInputs
  onChange: (inputs: OptionInputs) => void
}

export default function ControlsPanel({ inputs, onChange }: Props) {
  const set = <K extends keyof OptionInputs>(key: K, value: OptionInputs[K]) =>
    onChange({ ...inputs, [key]: value })

  return (
    <div className="flex flex-col gap-2">
      {/* ── Option type ── */}
      <div className="glass-card p-4 mb-2">
        <p className="label-mono text-xs mb-3">Option Type</p>
        <div className="grid grid-cols-2 gap-2">
          {(['call', 'put'] as const).map((t) => (
            <button
              key={t}
              onClick={() => set('optionType', t)}
              className={`toggle-btn ${
                inputs.optionType === t
                  ? t === 'call'
                    ? 'active-green'
                    : 'active-red'
                  : ''
              }`}
            >
              {t === 'call' ? '📈 Call' : '📉 Put'}
            </button>
          ))}
        </div>

        <p className="label-mono text-xs mt-4 mb-3">Your Position</p>
        <div className="grid grid-cols-2 gap-2">
          {(['buyer', 'seller'] as const).map((s) => (
            <button
              key={s}
              onClick={() => set('side', s)}
              className={`toggle-btn ${
                inputs.side === s
                  ? s === 'buyer'
                    ? 'active-blue'
                    : 'active-orange'
                  : ''
              }`}
            >
              {s === 'buyer' ? '🟦 Buyer' : '🟧 Seller'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sliders ── */}
      <div className="glass-card p-4">
        <p className="label-mono text-xs mb-4">Parameters</p>

        <SliderControl
          label="Stock Price"
          value={inputs.stockPrice}
          min={10}
          max={500}
          step={0.5}
          unit="prefix-$"
          accentColor="#00e5a0"
          description="Current market price of the underlying stock"
          onChange={(v) => set('stockPrice', v)}
        />

        <SliderControl
          label="Strike Price"
          value={inputs.strikePrice}
          min={10}
          max={500}
          step={0.5}
          unit="prefix-$"
          accentColor="#38bdf8"
          description="The price at which you can buy (call) or sell (put) the stock"
          onChange={(v) => set('strikePrice', v)}
        />

        <SliderControl
          label="Days to Expiry"
          value={inputs.daysToExpiry}
          min={0}
          max={365}
          step={1}
          unit="suffix-d"
          accentColor="#a78bfa"
          description="How many days until the option expires and becomes worthless"
          onChange={(v) => set('daysToExpiry', Math.round(v))}
        />

        <SliderControl
          label="Implied Volatility"
          value={inputs.impliedVolatility}
          min={5}
          max={150}
          step={0.5}
          unit="suffix-%"
          accentColor="#fb923c"
          description="Market's forecast of future price swings. Higher = more expensive options"
          onChange={(v) => set('impliedVolatility', v)}
        />

        <SliderControl
          label="Risk-Free Rate"
          value={inputs.riskFreeRate}
          min={0}
          max={15}
          step={0.1}
          unit="suffix-%"
          accentColor="#f472b6"
          description="Annual interest rate (e.g. US Treasury rate). Affects option pricing slightly"
          onChange={(v) => set('riskFreeRate', v)}
        />
      </div>
    </div>
  )
}
