import { motion } from 'framer-motion'
import type { BSResult, OptionInputs } from '../types'

interface Greek {
  key: keyof BSResult
  symbol: string
  name: string
  color: string
  format: (v: number) => string
  sign: (v: number, inputs: OptionInputs) => 'positive' | 'negative' | 'neutral'
  blurb: (v: number, inputs: OptionInputs) => string
}

function fmt4(v: number) { return v.toFixed(4) }
function fmt2(v: number) { return v.toFixed(4) }

const GREEKS: Greek[] = [
  {
    key: 'delta',
    symbol: 'Δ',
    name: 'Delta',
    color: '#00e5a0',
    format: (v) => v.toFixed(4),
    sign: (v, inp) => {
      if (inp.side === 'buyer') return v >= 0 ? 'positive' : 'negative'
      return v >= 0 ? 'negative' : 'positive'
    },
    blurb: (v, inp) =>
      `For every $1 the stock moves, the option premium moves $${Math.abs(v).toFixed(3)}. ${
        inp.optionType === 'call'
          ? 'Call deltas are positive (0 to 1).'
          : 'Put deltas are negative (-1 to 0).'
      }`,
  },
  {
    key: 'gamma',
    symbol: 'Γ',
    name: 'Gamma',
    color: '#38bdf8',
    format: (v) => v.toFixed(5),
    sign: (v, inp) => (inp.side === 'buyer' ? 'positive' : 'negative'),
    blurb: (v) =>
      `Gamma is the rate of change of delta. High gamma (${v.toFixed(4)}) means delta is very sensitive to price moves — often near expiry or ATM.`,
  },
  {
    key: 'theta',
    symbol: 'θ',
    name: 'Theta',
    color: '#a78bfa',
    format: (v) => v.toFixed(4),
    sign: (_v, inp) => (inp.side === 'buyer' ? 'negative' : 'positive'),
    blurb: (v, inp) =>
      `Every day that passes, this option loses $${Math.abs(v).toFixed(4)} in value (time decay). ${
        inp.side === 'seller'
          ? 'As a seller, theta works FOR you.'
          : 'As a buyer, theta works AGAINST you.'
      }`,
  },
  {
    key: 'vega',
    symbol: 'ν',
    name: 'Vega',
    color: '#fb923c',
    format: (v) => v.toFixed(4),
    sign: (v, inp) => {
      if (inp.side === 'buyer') return v >= 0 ? 'positive' : 'neutral'
      return v >= 0 ? 'negative' : 'positive'
    },
    blurb: (v) =>
      `For every 1% rise in implied volatility, the premium changes by $${Math.abs(v).toFixed(4)}. High vega = option is very sensitive to IV changes.`,
  },
  {
    key: 'rho',
    symbol: 'ρ',
    name: 'Rho',
    color: '#f472b6',
    format: (v) => v.toFixed(4),
    sign: (v) => (v >= 0 ? 'positive' : 'negative'),
    blurb: (v) =>
      `For every 1% rise in interest rates, premium changes by $${Math.abs(v).toFixed(4)}. Rho matters most on long-dated options.`,
  },
]

const colorMap = {
  positive: '#00e5a0',
  negative: '#ff3b5c',
  neutral: '#9ca3af',
}

interface Props {
  result: BSResult
  inputs: OptionInputs
}

export default function GreeksPanel({ result, inputs }: Props) {
  return (
    <div className="glass-card p-5">
      <p className="label-mono text-xs mb-4">The Greeks</p>
      <div className="flex flex-col gap-2">
        {GREEKS.map((g, i) => {
          const val = result[g.key] as number
          const sentiment = g.sign(val, inputs)
          const valColor = colorMap[sentiment]

          return (
            <motion.div
              key={g.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl p-3 cursor-default transition-colors duration-150"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl font-syne font-bold w-8 text-center"
                    style={{ color: g.color }}
                  >
                    {g.symbol}
                  </span>
                  <div>
                    <p className="text-sm font-syne font-semibold text-white leading-none">
                      {g.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5 hidden group-hover:block">
                      {g.blurb(val, inputs)}
                    </p>
                    <p className="text-xs text-muted mt-0.5 group-hover:hidden">
                      Hover for explanation
                    </p>
                  </div>
                </div>
                <span
                  className="value-mono text-sm tabular-nums"
                  style={{ color: valColor }}
                >
                  {val >= 0 ? '+' : ''}{g.format(val)}
                </span>
              </div>

              {/* Bar indicator */}
              <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: g.color }}
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${Math.min(100, Math.abs(val) * (g.key === 'delta' ? 100 : g.key === 'gamma' ? 50000 : g.key === 'theta' ? 5000 : g.key === 'vega' ? 500 : 200))}%`,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
