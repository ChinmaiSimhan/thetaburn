import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts'
import { generatePremiumCurve, generatePnLCurve, generateThetaDecay } from '../lib/blackScholes'
import type { OptionInputs, BSResult } from '../types'

interface Props {
  inputs: OptionInputs
  result: BSResult
}

const TABS = ['Premium Curve', 'P&L at Expiry', 'Theta Decay'] as const
type Tab = (typeof TABS)[number]

const CustomTooltip = ({
  active,
  payload,
  label,
  prefix = '$',
}: {
  active?: boolean
  payload?: { value: number; name: string; color: string }[]
  label?: number
  prefix?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs font-mono"
      style={{
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
    >
      <p className="text-subtle mb-1">{prefix}{Number(label).toFixed(2)}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value < 0 ? '-' : '+'}${Math.abs(p.value).toFixed(2)}
        </p>
      ))}
    </div>
  )
}

export default function ChartsPanel({ inputs, result }: Props) {
  const [tab, setTab] = useState<Tab>('Premium Curve')

  const T      = inputs.daysToExpiry / 365
  const r      = inputs.riskFreeRate / 100
  const sigma  = inputs.impliedVolatility / 100
  const K      = inputs.strikePrice
  const S      = inputs.stockPrice
  const type   = inputs.optionType
  const side   = inputs.side

  const premiumData = useMemo(
    () => generatePremiumCurve(K, T, r, sigma, type, S),
    [K, T, r, sigma, type, S],
  )

  const pnlData = useMemo(
    () => generatePnLCurve(K, result.premium, type, side),
    [K, result.premium, type, side],
  )

  const thetaData = useMemo(
    () => generateThetaDecay(S, K, inputs.daysToExpiry, r, sigma, type),
    [S, K, inputs.daysToExpiry, r, sigma, type],
  )

  const breakeven =
    type === 'call' ? K + result.premium : K - result.premium

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200"
            style={
              tab === t
                ? {
                    background: 'rgba(0,229,160,0.15)',
                    color: '#00e5a0',
                    border: '1px solid rgba(0,229,160,0.3)',
                  }
                : {
                    background: 'transparent',
                    color: '#6b7280',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-[240px]">
        {tab === 'Premium Curve' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={premiumData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="premGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00e5a0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00e5a0" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="price"
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'Space Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'Space Mono' }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip prefix="S=" />} />
              <Legend
                wrapperStyle={{ fontSize: 10, fontFamily: 'Space Mono', paddingTop: 8 }}
              />
              <ReferenceLine
                x={S}
                stroke="rgba(255,255,255,0.3)"
                strokeDasharray="4 4"
                label={{ value: 'Current', position: 'top', fill: '#9ca3af', fontSize: 10 }}
              />
              <ReferenceLine
                x={K}
                stroke="rgba(251,146,60,0.5)"
                strokeDasharray="4 4"
                label={{ value: 'Strike', position: 'insideTopRight', fill: '#fb923c', fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="premium"
                name="Premium"
                stroke="#00e5a0"
                strokeWidth={2}
                fill="url(#premGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#00e5a0' }}
              />
              <Area
                type="monotone"
                dataKey="intrinsic"
                name="Intrinsic"
                stroke="#38bdf8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="url(#intGrad)"
                dot={false}
                activeDot={{ r: 3, fill: '#38bdf8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {tab === 'P&L at Expiry' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pnlData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="pnlGreenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00e5a0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00e5a0" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="pnlRedGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="5%"  stopColor="#ff3b5c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="price"
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'Space Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'Space Mono' }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip prefix="S=" />} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              <ReferenceLine
                x={S}
                stroke="rgba(255,255,255,0.3)"
                strokeDasharray="4 4"
                label={{ value: 'Current', position: 'top', fill: '#9ca3af', fontSize: 10 }}
              />
              <ReferenceLine
                x={breakeven}
                stroke="#fbbf24"
                strokeDasharray="4 4"
                label={{ value: 'B/E', position: 'top', fill: '#fbbf24', fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="pnl"
                name="P&L"
                stroke="#00e5a0"
                strokeWidth={2}
                fill="url(#pnlGreenGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#00e5a0' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {tab === 'Theta Decay' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={thetaData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="thetaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="days"
                tickFormatter={(v) => `${v}d`}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'Space Mono' }}
                axisLine={false}
                tickLine={false}
                reversed
              />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'Space Mono' }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip prefix="Days=" />} />
              <ReferenceLine
                x={inputs.daysToExpiry}
                stroke="rgba(255,255,255,0.3)"
                strokeDasharray="4 4"
                label={{ value: 'Today', position: 'top', fill: '#9ca3af', fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="premium"
                name="Premium"
                stroke="#a78bfa"
                strokeWidth={2}
                fill="url(#thetaGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#a78bfa' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart hints */}
      <div className="mt-3 text-xs font-mono text-muted leading-relaxed">
        {tab === 'Premium Curve' &&
          'Green line = option premium at different stock prices. Blue dashes = intrinsic value.'}
        {tab === 'P&L at Expiry' &&
          `P&L per contract at expiry. Yellow line = breakeven at $${breakeven.toFixed(2)}.`}
        {tab === 'Theta Decay' &&
          'How premium erodes over time as expiry approaches. Decay accelerates near expiry.'}
      </div>
    </div>
  )
}
