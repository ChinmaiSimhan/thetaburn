import type { BSResult } from '../types';

// ─── Normal distribution helpers ────────────────────────────────────────────

/** Cumulative distribution function using Abramowitz & Stegun approximation (max error ≈ 7.5e-8) */
function normalCDF(x: number): number {
  if (x < -8) return 0;
  if (x > 8) return 1;

  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const t = 1 / (1 + 0.2316419 * absX);
  const d = 0.3989422820 * Math.exp((-absX * absX) / 2);
  const poly =
    t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  const result = 1 - d * poly;

  return sign === 1 ? result : 1 - result;
}

/** Standard normal probability density function */
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// ─── Black-Scholes core ──────────────────────────────────────────────────────

export interface BSInputs {
  S: number;      // Stock price
  K: number;      // Strike price
  T: number;      // Time to expiry in years
  r: number;      // Risk-free rate (decimal, e.g. 0.05)
  sigma: number;  // Implied volatility (decimal, e.g. 0.30)
  type: 'call' | 'put';
}

export function blackScholes(inputs: BSInputs): BSResult {
  const { S, K, r, sigma, type } = inputs;
  // Clamp T to avoid division by zero; near-zero = effectively at expiry
  const T = Math.max(inputs.T, 1 / (365 * 24));

  const sqrtT = Math.sqrt(T);
  const sigSqrtT = sigma * sqrtT;

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / sigSqrtT;
  const d2 = d1 - sigSqrtT;

  const Nd1  = normalCDF(d1);
  const Nd2  = normalCDF(d2);
  const Nnd1 = normalCDF(-d1);
  const Nnd2 = normalCDF(-d2);
  const nd1  = normalPDF(d1);

  const df = Math.exp(-r * T); // discount factor

  let premium: number;
  let delta: number;
  let theta: number; // per calendar day (divide annualized by 365)
  let rho: number;   // per 1 percentage-point change in rate

  if (type === 'call') {
    premium = S * Nd1 - K * df * Nd2;
    delta   = Nd1;
    theta   = ((-S * nd1 * sigma) / (2 * sqrtT) - r * K * df * Nd2) / 365;
    rho     = (K * T * df * Nd2) / 100;
  } else {
    premium = K * df * Nnd2 - S * Nnd1;
    delta   = Nd1 - 1;
    theta   = ((-S * nd1 * sigma) / (2 * sqrtT) + r * K * df * Nnd2) / 365;
    rho     = (-K * T * df * Nnd2) / 100;
  }

  const gamma = nd1 / (S * sigSqrtT);
  const vega  = (S * nd1 * sqrtT) / 100;

  const intrinsicValue = Math.max(0, type === 'call' ? S - K : K - S);
  const timeValue      = Math.max(0, Math.max(0, premium) - intrinsicValue);

  return {
    premium:       Math.max(0, premium),
    delta,
    gamma,
    theta,
    vega,
    rho,
    d1,
    d2,
    intrinsicValue,
    timeValue,
  };
}

// ─── Chart data generators ───────────────────────────────────────────────────

import type { PremiumChartPoint, PnLChartPoint, ThetaDecayPoint } from '../types';

/** Generate premium vs stock-price curve for current inputs */
export function generatePremiumCurve(
  K: number,
  T: number,
  r: number,
  sigma: number,
  type: 'call' | 'put',
  currentS: number,
  points = 80,
): PremiumChartPoint[] {
  const low  = K * 0.60;
  const high = K * 1.40;
  const data: PremiumChartPoint[] = [];

  for (let i = 0; i <= points; i++) {
    const S = low + ((high - low) * i) / points;
    const res = blackScholes({ S, K, T, r, sigma, type });
    data.push({
      price:     +S.toFixed(2),
      premium:   +res.premium.toFixed(4),
      intrinsic: +res.intrinsicValue.toFixed(4),
    });
  }

  // Mark current price point
  const curr = blackScholes({ S: currentS, K, T, r, sigma, type });
  data.push({ price: +currentS.toFixed(2), premium: +curr.premium.toFixed(4), intrinsic: +curr.intrinsicValue.toFixed(4) });
  data.sort((a, b) => a.price - b.price);

  return data;
}

/** Generate P&L at expiry for a given entry premium */
export function generatePnLCurve(
  K: number,
  entryPremium: number,
  type: 'call' | 'put',
  side: 'buyer' | 'seller',
  points = 80,
): PnLChartPoint[] {
  const low  = K * 0.60;
  const high = K * 1.40;
  const data: PnLChartPoint[] = [];
  const multiplier = side === 'buyer' ? 1 : -1;

  for (let i = 0; i <= points; i++) {
    const S         = low + ((high - low) * i) / points;
    const intrinsic = Math.max(0, type === 'call' ? S - K : K - S);
    const pnl       = multiplier * (intrinsic - entryPremium) * 100; // per contract (100 shares)
    data.push({ price: +S.toFixed(2), pnl: +pnl.toFixed(2) });
  }

  return data;
}

/** Generate theta-decay curve from current DTE down to 0 */
export function generateThetaDecay(
  S: number,
  K: number,
  maxDays: number,
  r: number,
  sigma: number,
  type: 'call' | 'put',
): ThetaDecayPoint[] {
  const data: ThetaDecayPoint[] = [];
  const steps = Math.min(maxDays, 180);

  for (let i = steps; i >= 0; i--) {
    const daysLeft = Math.round((maxDays * i) / steps);
    const T        = Math.max(daysLeft / 365, 1 / (365 * 24));
    const res      = blackScholes({ S, K, T, r, sigma, type });
    data.push({ days: daysLeft, premium: +res.premium.toFixed(4) });
  }

  return data.sort((a, b) => a.days - b.days);
}
