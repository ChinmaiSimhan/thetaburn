import { useState, useMemo, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { blackScholes } from '../lib/blackScholes'
import ControlsPanel from './ControlsPanel'
import PremiumCard from './PremiumCard'
import GreeksPanel from './GreeksPanel'
import ChartsPanel from './ChartsPanel'
import QuickSimPanel from './QuickSimPanel'
import ExplanationPanel from './ExplanationPanel'
import type { OptionInputs, ExplanationState, SimAction } from '../types'

const DEFAULT_INPUTS: OptionInputs = {
  stockPrice: 100,
  strikePrice: 100,
  daysToExpiry: 30,
  impliedVolatility: 30,
  riskFreeRate: 5,
  optionType: 'call',
  side: 'buyer',
}

interface Props {
  onBack: () => void
}

export default function Dashboard({ onBack }: Props) {
  const [inputs, setInputs] = useState<OptionInputs>(DEFAULT_INPUTS)
  const [entryPremium, setEntryPremium] = useState<number | null>(null)
  const [explanation, setExplanation] = useState<ExplanationState | null>(null)
  const prevInputsRef = useRef<OptionInputs>(DEFAULT_INPUTS)

  const result = useMemo(
    () =>
      blackScholes({
        S: inputs.stockPrice,
        K: inputs.strikePrice,
        T: Math.max(inputs.daysToExpiry / 365, 1 / (365 * 24)),
        r: inputs.riskFreeRate / 100,
        sigma: inputs.impliedVolatility / 100,
        type: inputs.optionType,
      }),
    [inputs],
  )

  const handleInputsChange = useCallback(
    (newInputs: OptionInputs) => {
      const prevResult = blackScholes({
        S: prevInputsRef.current.stockPrice,
        K: prevInputsRef.current.strikePrice,
        T: Math.max(prevInputsRef.current.daysToExpiry / 365, 1 / (365 * 24)),
        r: prevInputsRef.current.riskFreeRate / 100,
        sigma: prevInputsRef.current.impliedVolatility / 100,
        type: prevInputsRef.current.optionType,
      })

      const currResult = blackScholes({
        S: newInputs.stockPrice,
        K: newInputs.strikePrice,
        T: Math.max(newInputs.daysToExpiry / 365, 1 / (365 * 24)),
        r: newInputs.riskFreeRate / 100,
        sigma: newInputs.impliedVolatility / 100,
        type: newInputs.optionType,
      })

      setExplanation({
        action: 'slider',
        prevInputs: prevInputsRef.current,
        prevResult,
        currInputs: newInputs,
        currResult,
      })

      prevInputsRef.current = newInputs
      setInputs(newInputs)
    },
    [],
  )

  const handleQuickSim = useCallback(
    (newInputs: OptionInputs, label: string) => {
      const prevResult = blackScholes({
        S: prevInputsRef.current.stockPrice,
        K: prevInputsRef.current.strikePrice,
        T: Math.max(prevInputsRef.current.daysToExpiry / 365, 1 / (365 * 24)),
        r: prevInputsRef.current.riskFreeRate / 100,
        sigma: prevInputsRef.current.impliedVolatility / 100,
        type: prevInputsRef.current.optionType,
      })

      const currResult = blackScholes({
        S: newInputs.stockPrice,
        K: newInputs.strikePrice,
        T: Math.max(newInputs.daysToExpiry / 365, 1 / (365 * 24)),
        r: newInputs.riskFreeRate / 100,
        sigma: newInputs.impliedVolatility / 100,
        type: newInputs.optionType,
      })

      const actionMap: Record<string, SimAction> = {
        'Stock +5%': 'stock-up',
        'Stock -5%': 'stock-down',
        'IV Crush': 'iv-crush',
        'IV Spike': 'iv-spike',
        '7 Days Pass': 'time-pass',
        'Expiry Day': 'expiry',
      }

      setExplanation({
        action: actionMap[label] ?? 'slider',
        prevInputs: prevInputsRef.current,
        prevResult,
        currInputs: newInputs,
        currResult,
      })

      prevInputsRef.current = newInputs
      setInputs(newInputs)
    },
    [],
  )

  const handleReset = useCallback(() => {
    prevInputsRef.current = DEFAULT_INPUTS
    setInputs(DEFAULT_INPUTS)
    setEntryPremium(null)
    setExplanation(null)
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07090c' }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 border-b"
        style={{
          background: 'rgba(7,9,12,0.85)',
          borderColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted hover:text-white transition-colors text-sm font-mono"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <span className="font-syne font-extrabold text-lg">
            <span className="gradient-text">Theta</span>
            <span className="text-white">Burn</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono"
            style={{ color: '#00e5a0' }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            LIVE
          </span>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-white transition-colors px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20"
          >
            <RefreshCw size={12} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* ── Main grid ── */}
      <main className="flex-1 p-3 md:p-5 xl:p-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr_1fr] xl:grid-cols-[340px_1fr_1fr] gap-4">

          {/* ── Column 1: Controls ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <ControlsPanel inputs={inputs} onChange={handleInputsChange} />
            <QuickSimPanel inputs={inputs} onSim={handleQuickSim} />
          </motion.div>

          {/* ── Column 2: Premium + Greeks ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <PremiumCard
              result={result}
              inputs={inputs}
              entryPremium={entryPremium}
              onSetEntry={() => setEntryPremium(result.premium)}
            />
            <GreeksPanel result={result} inputs={inputs} />
          </motion.div>

          {/* ── Column 3: Charts ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="flex-1 min-h-[360px]">
              <ChartsPanel inputs={inputs} result={result} />
            </div>
          </motion.div>
        </div>

        {/* ── Explanation panel (full width) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="max-w-[1600px] mx-auto mt-4"
        >
          <ExplanationPanel state={explanation} result={result} />
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-3 px-6 text-center text-xs font-mono text-muted border-t border-white/5">
        ThetaBurn — Educational Black-Scholes simulator · Not financial advice
      </footer>
    </div>
  )
}
