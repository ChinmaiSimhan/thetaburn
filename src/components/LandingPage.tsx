import { motion } from 'framer-motion'
import { ArrowRight, TrendingDown, Zap, BookOpen } from 'lucide-react'

interface Props {
  onLaunch: () => void
}

const GREEK_SYMBOLS = [
  { sym: 'Δ', label: 'Delta', color: '#00e5a0', x: '8%',  y: '20%' },
  { sym: 'Γ', label: 'Gamma', color: '#38bdf8', x: '88%', y: '25%' },
  { sym: 'θ', label: 'Theta', color: '#a78bfa', x: '6%',  y: '72%' },
  { sym: 'ν', label: 'Vega',  color: '#fb923c', x: '90%', y: '68%' },
  { sym: 'ρ', label: 'Rho',   color: '#f472b6', x: '50%', y: '88%' },
]

const FEATURES = [
  {
    icon: <Zap size={18} />,
    title: 'Live Black-Scholes',
    desc: 'Real-time option pricing as you move sliders',
    color: '#00e5a0',
  },
  {
    icon: <TrendingDown size={18} />,
    title: 'Interactive Greeks',
    desc: 'Delta, Gamma, Theta, Vega & Rho explained visually',
    color: '#38bdf8',
  },
  {
    icon: <BookOpen size={18} />,
    title: 'Beginner Friendly',
    desc: 'Plain English explanations for every change',
    color: '#a78bfa',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function LandingPage({ onLaunch }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden hero-grid">
      {/* ── Radial glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(0,229,160,0.14), transparent 70%)',
        }}
      />

      {/* ── Floating Greek symbols ── */}
      {GREEK_SYMBOLS.map((g, i) => (
        <motion.div
          key={g.sym}
          className="pointer-events-none absolute hidden md:flex flex-col items-center gap-1"
          style={{ left: g.x, top: g.y }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span
            className="text-4xl font-syne font-bold opacity-20"
            style={{ color: g.color }}
          >
            {g.sym}
          </span>
          <span className="text-xs font-mono opacity-10" style={{ color: g.color }}>
            {g.label}
          </span>
        </motion.div>
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl w-full"
        >
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 mb-8">
            <span
              className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
              style={{
                background: 'rgba(0,229,160,0.1)',
                borderColor: 'rgba(0,229,160,0.3)',
                color: '#00e5a0',
              }}
            >
              ● LIVE OPTIONS PRICING
            </span>
          </motion.div>

          {/* Logo / Title */}
          <motion.h1
            variants={item}
            className="font-syne font-extrabold leading-none mb-4"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
          >
            <span className="gradient-text">Theta</span>
            <span className="text-white">Burn</span>
          </motion.h1>

          {/* Sub-tagline */}
          <motion.p
            variants={item}
            className="text-subtle text-lg md:text-xl font-light mb-3 max-w-xl mx-auto"
          >
            An interactive Black-Scholes simulator for options beginners.
          </motion.p>
          <motion.p
            variants={item}
            className="text-muted text-sm font-mono mb-12 max-w-lg mx-auto leading-relaxed"
          >
            Drag sliders. Watch premiums move. Understand the Greeks. <br />
            No jargon — just intuition.
          </motion.p>

          {/* CTA */}
          <motion.button
            variants={item}
            onClick={onLaunch}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-syne font-bold text-lg text-black transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #00e5a0, #00c47a)',
              boxShadow: '0 0 30px rgba(0,229,160,0.35)',
            }}
          >
            Launch Simulator
            <ArrowRight size={20} />
          </motion.button>

          {/* Features */}
          <motion.div
            variants={item}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 text-left"
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card p-5 flex flex-col gap-3"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${f.color}18`, color: f.color }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="font-syne font-semibold text-white text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            variants={item}
            className="mt-10 text-xs text-muted opacity-50"
          >
            For educational purposes only. Not financial advice.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
