import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

export default function App() {
  const [page, setPage] = useState<'landing' | 'dashboard'>('landing')

  return (
    <div className="min-h-screen bg-base text-white font-body">
      <AnimatePresence mode="wait">
        {page === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onLaunch={() => setPage('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard onBack={() => setPage('landing')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
