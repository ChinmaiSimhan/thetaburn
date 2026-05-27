import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BSResult, OptionInputs } from '../types'

interface Props {
  result: BSResult
  inputs: OptionInputs
  entryPremium: number | null
  onSetEntry: () => void
}

function useAnimatedValue(value: number) {
  const [key, setKey] = useState(0)
  const prev = useRef(value)

  useEffect(() => {
    if (Math.abs(value - prev.current) > 0.0001) {
      setKey((k) => k + 1)
      prev.current = value
    }
  }, [value])

  return key
}

export default function PremiumCard({ result, inputs, entryPremium, onSetEntry }: Props) {
  const animKey = useAnimatedValue(result.premium)

  const isITM =
    inputs.optionType === 'call'
      ? inputs.stockPrice > inputs.strikePrice
      : inputs.stockPrice < inputs.strikePrice

  const moneynessLabel = isITM ? 'IN THE MONEY' : inputs.stockPrice === inputs.strikePrice ? 'AT THE MONEY' : 'OUT OF THE MONEY'
  const moneynessColor = isITM ? '#00e5a0' : inputs.stockPrice === inputs.strikePrice ? '#38bdf8' : '#9ca3af'

  const pnl = entryPremium !== null
    ? (result.premium - entryPremium) * (inputs.side === 'buyer' ? 1 : -1) * 100
    : null

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-mono font-bold"
            style={{
              background: `${moneynessColor}18`,
              color: moneynessColor,
              border: `1px solid ${moneynessColor}30`,
            }}
          >
            {moneynessLabel}
          </span>
          <span className="text-xs font-mono text-muted uppercase">
            {inputs.optionType} · {inputs.side}
          </span>
        </div>
        <button
          onClick={onSetEntry}
          className="text-xs font-mono px-3 py-1 rounded-lg transition-colors"
          style={{
            background: 'rgba(56,189,248,0.1)',
            color: '#38bdf8',
            border: '1px solid rgba(56,189,248,0.25)',
          }}
        >
          📌 Set Entry
        </button>
      </div>

      {/* Premium */}
      <div className="mb-4">
        <p className="label-mono text-xs mb-1">Option Premium</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            initial={{ opacity: 0.5, scale: 1.08, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="font-syne font-extrabold"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#00e5a0' }}
          >
            ${result.premium.toFixed(2)}
          </motion.div>
        </AnimatePresence>
        <p className="text-xs text-muted font-mono">per share · ×100 per contract</p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="label-mono text-xs mb-1">Intrinsic Value</p>
          <p className="value-mono text-base" style={{ color: isITM ? '#00e5a0' : '#4b5563' }}>
            ${result.intrinsicValue.toFixed(2)}
          </p>
          <p className="text-xs text-muted mt-0.5">What you'd get today</p>
        </div>
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="label-mono text-xs mb-1">Time Value</p>
          <p className="value-mono text-base" style={{ color: '#a78bfa' }}>
            ${result.timeValue.toFixed(2)}
          </p>
          <p className="text-xs text-muted mt-0.5">Hope &amp; uncertainty</p>
        </div>
      </div>

      {/* Contract value */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3"
        style={{ background: 'rgba(0,229,160,0.06)', border: '1px solid rgba(0,229,160,0.12)' }}
      >
        <span className="text-xs font-mono text-muted">1 Contract (100 shares)</span>
        <span className="font-mono font-bold text-white">
          ${(result.premium * 100).toFixed(2)}
        </span>
      </div>

      {/* P&L from entry */}
      {pnl !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 flex items-center justify-between rounded-xl px-4 py-3"
          style={{
            background: pnl >= 0 ? 'rgba(0,229,160,0.08)' : 'rgba(255,59,92,0.08)',
            border: `1px solid ${pnl >= 0 ? 'rgba(0,229,160,0.2)' : 'rgba(255,59,92,0.2)'}`,
          }}
        >
          <span className="text-xs font-mono" style={{ color: pnl >= 0 ? '#00e5a0' : '#ff3b5c' }}>
            P&amp;L since entry
          </span>
          <span
            className="font-mono font-bold"
            style={{ color: pnl >= 0 ? '#00e5a0' : '#ff3b5c' }}
          >
            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
          </span>
        </motion.div>
      )}
    </div>
  )
}
