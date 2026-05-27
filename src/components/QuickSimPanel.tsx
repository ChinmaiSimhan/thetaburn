import { motion } from 'framer-motion'
import type { OptionInputs } from '../types'

interface SimButton {
  label: string
  emoji: string
  description: string
  apply: (inputs: OptionInputs) => OptionInputs
  color: string
}

const SIMS: SimButton[] = [
  {
    label: 'Stock +5%',
    emoji: '🚀',
    description: 'Price rallies 5%',
    color: '#00e5a0',
    apply: (i) => ({ ...i, stockPrice: +(i.stockPrice * 1.05).toFixed(2) }),
  },
  {
    label: 'Stock -5%',
    emoji: '📉',
    description: 'Price dumps 5%',
    color: '#ff3b5c',
    apply: (i) => ({ ...i, stockPrice: +(i.stockPrice * 0.95).toFixed(2) }),
  },
  {
    label: 'IV Crush',
    emoji: '💨',
    description: 'Volatility drops 20 pts',
    color: '#fb923c',
    apply: (i) => ({ ...i, impliedVolatility: Math.max(5, i.impliedVolatility - 20) }),
  },
  {
    label: 'IV Spike',
    emoji: '⚡',
    description: 'Volatility spikes 20 pts',
    color: '#fbbf24',
    apply: (i) => ({ ...i, impliedVolatility: Math.min(150, i.impliedVolatility + 20) }),
  },
  {
    label: '7 Days Pass',
    emoji: '⏳',
    description: 'One week of theta decay',
    color: '#a78bfa',
    apply: (i) => ({ ...i, daysToExpiry: Math.max(0, i.daysToExpiry - 7) }),
  },
  {
    label: 'Expiry Day',
    emoji: '💀',
    description: 'Option expires today',
    color: '#f472b6',
    apply: (i) => ({ ...i, daysToExpiry: 0 }),
  },
]

interface Props {
  onSim: (inputs: OptionInputs, label: string) => void
  inputs: OptionInputs
}

export default function QuickSimPanel({ onSim, inputs }: Props) {
  return (
    <div className="glass-card p-4">
      <p className="label-mono text-xs mb-3">Quick Scenarios</p>
      <div className="grid grid-cols-2 gap-2">
        {SIMS.map((sim, i) => (
          <motion.button
            key={sim.label}
            whileTap={{ scale: 0.93 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSim(sim.apply(inputs), sim.label)}
            className="sim-btn text-left flex flex-col gap-0.5 p-3"
          >
            <span className="flex items-center gap-1.5">
              <span>{sim.emoji}</span>
              <span
                className="font-mono font-bold text-xs"
                style={{ color: sim.color }}
              >
                {sim.label}
              </span>
            </span>
            <span className="text-muted text-xs leading-tight">{sim.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
