import { motion, AnimatePresence } from 'framer-motion'
import type { ExplanationState } from '../types'

function generateExplanation(state: ExplanationState): { title: string; body: string; color: string } {
  const { action, prevInputs, prevResult, currInputs, currResult } = state
  const premChange = currResult.premium - prevResult.premium
  const pctChange = prevResult.premium > 0 ? (premChange / prevResult.premium) * 100 : 0
  const premDir = premChange > 0 ? 'increased' : premChange < 0 ? 'decreased' : 'unchanged'
  const sign = premChange >= 0 ? '+' : ''
  const changeStr = `${sign}$${premChange.toFixed(2)} (${sign}${pctChange.toFixed(1)}%)`

  if (action === 'stock-up' || (action === 'slider' && currInputs.stockPrice !== prevInputs.stockPrice)) {
    const rose = currInputs.stockPrice > prevInputs.stockPrice
    const diff = Math.abs(currInputs.stockPrice - prevInputs.stockPrice).toFixed(2)
    const isCall = currInputs.optionType === 'call'
    return {
      title: `Stock price ${rose ? 'rose' : 'fell'} by $${diff}`,
      color: rose === isCall ? '#00e5a0' : '#ff3b5c',
      body: `The stock moved $${diff} ${rose ? 'up' : 'down'}, so the premium ${premDir} by ${changeStr}. 
      Delta (${currResult.delta.toFixed(3)}) predicted this — it tells you how much the option moves per $1 of stock change.
      ${isCall
        ? rose
          ? '✅ Call options gain value when the stock rises. You want the stock to keep climbing!'
          : '⚠️ Call options lose value when the stock falls. The option is moving away from profit.'
        : rose
        ? '⚠️ Put options lose value when the stock rises. The option is moving away from profit.'
        : '✅ Put options gain value when the stock falls. You want the stock to keep dropping!'}`,
    }
  }

  if (action === 'iv-crush' || action === 'iv-spike' || (action === 'slider' && currInputs.impliedVolatility !== prevInputs.impliedVolatility)) {
    const rose = currInputs.impliedVolatility > prevInputs.impliedVolatility
    const diff = Math.abs(currInputs.impliedVolatility - prevInputs.impliedVolatility).toFixed(1)
    return {
      title: action === 'iv-crush' ? '💨 IV Crush! Volatility collapsed' : rose ? '⚡ Volatility spiked' : '📉 Volatility dropped',
      color: rose ? '#fbbf24' : '#fb923c',
      body: `Implied volatility ${rose ? 'rose' : 'fell'} by ${diff}%, so the premium ${premDir} by ${changeStr}.
      Vega (${currResult.vega.toFixed(4)}) measures this — for every 1% IV change, the option moves ~$${Math.abs(currResult.vega).toFixed(4)}.
      ${action === 'iv-crush'
        ? '💡 IV crush is common after earnings. Option buyers lose money even if the stock moves in their direction!'
        : rose
        ? '💡 Rising IV makes options more expensive. Sellers love low IV; buyers love high IV (before they buy).'
        : '💡 Falling IV hurts option buyers. If you paid a lot for an option, watch out for IV drops!'}`,
    }
  }

  if (action === 'time-pass' || action === 'expiry' || (action === 'slider' && currInputs.daysToExpiry !== prevInputs.daysToExpiry)) {
    const daysDiff = prevInputs.daysToExpiry - currInputs.daysToExpiry
    return {
      title: action === 'expiry' ? '💀 Option expires today' : `⏳ ${daysDiff} day${daysDiff !== 1 ? 's' : ''} passed`,
      color: '#a78bfa',
      body: `${daysDiff} day${daysDiff !== 1 ? 's' : ''} passed, so the premium ${premDir} by ${changeStr}. This is theta decay in action!
      Theta (${currResult.theta.toFixed(4)}/day) is the ${currInputs.side === 'buyer' ? 'daily cost of holding this option' : 'daily profit from selling this option'}.
      ${currInputs.daysToExpiry <= 7
        ? '🔥 With less than a week left, theta decay is very fast. Options lose most of their value in the final days!'
        : '💡 Time decay accelerates as expiry approaches. Far-dated options decay slowly; near-expiry options decay rapidly.'}
      ${action === 'expiry' ? `\nAt expiry, only intrinsic value remains: $${currResult.intrinsicValue.toFixed(2)}` : ''}`,
    }
  }

  if (action === 'slider' && currInputs.riskFreeRate !== prevInputs.riskFreeRate) {
    const rose = currInputs.riskFreeRate > prevInputs.riskFreeRate
    return {
      title: `Interest rate ${rose ? 'rose' : 'fell'}`,
      color: '#f472b6',
      body: `Rho (${currResult.rho.toFixed(4)}) measures how interest rates affect the option. The premium ${premDir} by ${changeStr}.
      ${currInputs.optionType === 'call'
        ? 'Call options benefit slightly from higher rates — money you don\'t spend on stock can earn interest.'
        : 'Put options weaken slightly with higher rates — the strike price is worth less in today\'s dollars.'}
      💡 Rho matters most for long-dated options (LEAPS). For short-term options, the effect is small.`,
    }
  }

  // Default / initial state
  return {
    title: '📖 How to use ThetaBurn',
    color: '#38bdf8',
    body: `Move any slider or click a Quick Scenario to see how option pricing changes in real time.
    
    📌 Set Entry records your current premium so you can track P&L as conditions change.
    
    Key concepts: The premium ($${currResult.premium.toFixed(2)}) = Intrinsic Value ($${currResult.intrinsicValue.toFixed(2)}) + Time Value ($${currResult.timeValue.toFixed(2)}).
    
    Hover over any Greek for a detailed explanation of what it means.`,
  }
}

interface Props {
  state: ExplanationState | null
  result: {
    premium: number
    intrinsicValue: number
    timeValue: number
  }
}

export default function ExplanationPanel({ state, result }: Props) {
  const content = state
    ? generateExplanation(state)
    : {
        title: '📖 How to use ThetaBurn',
        color: '#38bdf8',
        body: `Move any slider or click a Quick Scenario to see how option pricing changes.\n\n📌 "Set Entry" records your current premium so you can track live P&L.\n\nCurrent Premium = $${result.premium.toFixed(2)} (Intrinsic: $${result.intrinsicValue.toFixed(2)} + Time: $${result.timeValue.toFixed(2)})\n\nHover over any Greek to learn what it measures.`,
      }

  return (
    <div
      className="glass-card p-5 rounded-2xl"
      style={{ borderColor: `${content.color}20` }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={content.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-1 self-stretch rounded-full"
              style={{ background: content.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-syne font-semibold text-white text-sm mb-2">
                {content.title}
              </p>
              <div className="text-xs text-subtle leading-relaxed whitespace-pre-line font-body">
                {content.body}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
