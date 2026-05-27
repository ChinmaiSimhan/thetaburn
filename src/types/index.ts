export interface OptionInputs {
  stockPrice: number;
  strikePrice: number;
  daysToExpiry: number;
  impliedVolatility: number; // percentage, e.g. 30 = 30%
  riskFreeRate: number;      // percentage, e.g. 5 = 5%
  optionType: 'call' | 'put';
  side: 'buyer' | 'seller';
}

export interface BSResult {
  premium: number;
  delta: number;
  gamma: number;
  theta: number;       // per day
  vega: number;        // per 1% IV change
  rho: number;         // per 1% rate change
  d1: number;
  d2: number;
  intrinsicValue: number;
  timeValue: number;
}

export interface PremiumChartPoint {
  price: number;
  premium: number;
  intrinsic: number;
}

export interface PnLChartPoint {
  price: number;
  pnl: number;
}

export interface ThetaDecayPoint {
  days: number;
  premium: number;
}

export type SimAction =
  | 'stock-up'
  | 'stock-down'
  | 'iv-crush'
  | 'iv-spike'
  | 'time-pass'
  | 'expiry'
  | 'slider';

export interface ExplanationState {
  action: SimAction;
  prevInputs: OptionInputs;
  prevResult: BSResult;
  currInputs: OptionInputs;
  currResult: BSResult;
}
