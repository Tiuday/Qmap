import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, Zap, MapPin, Navigation, Clock,
  TrendingUp, Eye, Heart, ArrowRight, Star, ChevronDown,
  Lock, Wifi, Coffee, Music
} from 'lucide-react'
import { QmapTextEffect } from '@/components/ui/text-effect'
import { FluidCanvas } from '@/components/ui/fluid-canvas'
import { Boxes } from '@/components/ui/background-boxes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ── Floating location ping ──────────────────────────────────
function LocationPing({
  x, y, color, label, delay
}: { x: number; y: number; color: string; label: string; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
    >
      <div className="relative">
        {/* Ripple */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: color, opacity: 0.3 }}
          animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
        />
        <div
          className="w-3 h-3 rounded-full border-2 border-white/80 shadow-lg relative z-10"
          style={{ background: color }}
        />
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap glass px-2 py-0.5 rounded-full text-xs font-medium"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.3 }}
        >
          {label}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Feature card ─────────────────────────────────────────────
function FeatureCard({
  icon: Icon, title, description, accent, delay
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  title: string
  description: string
  accent: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.5 }}
      className="group glass rounded-2xl p-6 hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <h3 className="text-base font-semibold text-white/90 mb-2">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{description}</p>
    </motion.div>
  )
}

// ── Stat counter ─────────────────────────────────────────────
function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <Icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/40">{label}</div>
    </motion.div>
  )
}

// ── Vibe type badge ──────────────────────────────────────────
const VIBE_TAGS = [
  { label: 'Introvert Friendly', icon: Coffee, color: '#8b5cf6' },
  { label: 'Safe Zone', icon: Shield, color: '#22c55e' },
  { label: 'Low Traffic', icon: Zap, color: '#06b6d4' },
  { label: 'Open Now', icon: Clock, color: '#f59e0b' },
  { label: 'Chill Vibe', icon: Music, color: '#ec4899' },
  { label: 'Female Friendly', icon: Heart, color: '#f43f5e' },
  { label: 'Metro Access', icon: Navigation, color: '#3b82f6' },
  { label: 'Crowd: Moderate', icon: Users, color: '#a78bfa' },
]

export default function Landing() {
  const navigate = useNavigate()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const [tagIndex, setTagIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTagIndex((i) => (i + 1) % VIBE_TAGS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090f] overflow-x-hidden">

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between glass rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Qmap</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/55 font-medium">
            <a href="#features" className="hover:text-white/90 transition-colors">Features</a>
            <a href="#safety" className="hover:text-white/90 transition-colors">Safety</a>
            <a href="#vibes" className="hover:text-white/90 transition-colors">Vibes</a>
          </div>

          <Button size="sm" onClick={() => navigate('/map')}>
            Open Map
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">

        {/* Background grid + glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.18),transparent)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 text-sm font-medium text-purple-300 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Real-time city intelligence, built for you
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Know the vibe
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent glow-text-purple">
              before you go.
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            Real-time crowd density, safety scores, traffic flow, and area vibes —
            all on one dark, gorgeous map. Made for Gen Z explorers, solo women, and everyone who values their time.
          </motion.p>

          {/* Animated vibe tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex items-center justify-center gap-2 mb-10"
          >
            <span className="text-sm text-white/30">Areas tagged with</span>
            <AnimatePresence mode="wait">
              {VIBE_TAGS.map((tag, i) =>
                i === tagIndex ? (
                  <motion.span
                    key={tag.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold border"
                    style={{
                      color: tag.color,
                      borderColor: `${tag.color}30`,
                      background: `${tag.color}15`,
                    }}
                  >
                    <tag.icon className="w-3.5 h-3.5" />
                    {tag.label}
                  </motion.span>
                ) : null,
              )}
            </AnimatePresence>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" onClick={() => navigate('/map')} className="group">
              <MapPin className="w-5 h-5" />
              Explore the Map
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary">
              <Eye className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex items-center justify-center gap-6 text-xs text-white/25"
          >
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" />No sign-up needed</span>
            <span className="flex items-center gap-1.5"><Wifi className="w-3 h-3" />Live data</span>
            <span className="flex items-center gap-1.5"><Star className="w-3 h-3" />100% free</span>
          </motion.div>
        </motion.div>

        {/* Hero map preview with location pings */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="relative z-10 mt-16 w-full max-w-4xl mx-auto px-4"
        >
          <div className="relative glass rounded-2xl overflow-hidden border border-purple-500/15 shadow-2xl shadow-purple-900/20"
            style={{ height: '340px' }}
          >
            {/* Fake dark map background */}
            <div className="absolute inset-0 bg-[#0d0d14]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
            </div>

            {/* Purple density heatmap blobs */}
            <div className="absolute inset-0">
              <div className="absolute w-48 h-48 rounded-full bg-purple-600/25 blur-3xl" style={{ top: '10%', left: '30%' }} />
              <div className="absolute w-32 h-32 rounded-full bg-fuchsia-500/20 blur-2xl" style={{ top: '40%', left: '55%' }} />
              <div className="absolute w-24 h-24 rounded-full bg-purple-800/20 blur-2xl" style={{ top: '20%', left: '15%' }} />
              <div className="absolute w-20 h-20 rounded-full bg-amber-500/15 blur-2xl" style={{ top: '55%', left: '25%' }} />
            </div>

            {/* Location pings */}
            <LocationPing x={32} y={20} color="#8b5cf6" label="Busy — CP" delay={1.2} />
            <LocationPing x={52} y={45} color="#22c55e" label="Safe — HKV" delay={1.5} />
            <LocationPing x={18} y={55} color="#f59e0b" label="Moderate" delay={1.8} />
            <LocationPing x={70} y={30} color="#ef4444" label="High Traffic" delay={2.1} />
            <LocationPing x={40} y={65} color="#06b6d4" label="Chill Zone" delay={2.4} />

            {/* Top HUD */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="glass rounded-xl px-3 py-1.5 text-xs font-medium text-white/70 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-purple-400" />
                Delhi, India
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
                Live
              </div>
              <div className="flex gap-2">
                <div className="glass rounded-lg px-2 py-1 text-xs text-purple-300 border border-purple-500/20">Crowd</div>
                <div className="glass rounded-lg px-2 py-1 text-xs text-emerald-300 border border-emerald-500/20">Safety</div>
                <div className="glass rounded-lg px-2 py-1 text-xs text-amber-300 border border-amber-500/20">Traffic</div>
              </div>
            </div>

            {/* Bottom legend */}
            <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-2">
              <div className="text-xs text-white/40 mb-1.5">Crowd Density</div>
              <div className="flex items-center gap-1">
                {['#1a0030', '#4a148c', '#7b1fa2', '#aa00ff', '#e040fb'].map((c, i) => (
                  <div key={i} className="w-6 h-2 rounded-sm" style={{ background: c }} />
                ))}
                <span className="text-xs text-white/30 ml-1">Max</span>
              </div>
            </div>

            {/* Scan line overlay */}
            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Chrome glow under */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-purple-600/20 blur-2xl rounded-full" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="relative py-20 border-y border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value="50+" label="Areas mapped" icon={MapPin} />
          <StatCard value="Real-time" label="Data refresh" icon={Wifi} />
          <StatCard value="0 bias" label="Verified inclusive" icon={Heart} />
          <StatCard value="Free" label="Always & forever" icon={Star} />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-24 px-6">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="purple" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything Google Maps{' '}
              <span className="text-white/30">won't</span>{' '}
              <span className="text-purple-400">tell you.</span>
            </h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">
              We built what you actually need before stepping out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Users}
              title="Live Crowd Density"
              description="Purple heatmap shows exactly how packed an area is right now — from empty to absolutely crammed."
              accent="#8b5cf6"
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Safety Score"
              description="Green, yellow, red zones based on crime data, lighting, and community reports. Know before you go."
              accent="#22c55e"
              delay={0.07}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Traffic Heatmap"
              description="See which roads are choked and which are clear. Pick the fastest path, not just the shortest."
              accent="#f59e0b"
              delay={0.14}
            />
            <FeatureCard
              icon={Clock}
              title="Open or Closed"
              description="Real-time status for markets, parks, malls, and venues. Never show up to a locked gate again."
              accent="#06b6d4"
              delay={0.21}
            />
            <FeatureCard
              icon={Navigation}
              title="Locality Shortcuts"
              description="Hidden local routes that only locals know. Faster paths from your exact neighbourhood."
              accent="#ec4899"
              delay={0.28}
            />
            <FeatureCard
              icon={Heart}
              title="Vibe Matching"
              description="Areas tagged for introverts, extroverts, solo women, couples, and more — zero bias, all belonging."
              accent="#f43f5e"
              delay={0.35}
            />
          </div>
        </div>
      </section>

      {/* ── Safety section ── */}
      <section id="safety" className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 h-96 overflow-hidden opacity-30">
          <Boxes />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="safe" className="mb-4" dot>Safety First</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Built especially for{' '}
                <span className="text-emerald-400">women</span> and{' '}
                <span className="text-purple-400">solo travellers.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                Qmap tags areas with real safety data — not just averages. We show you which neighbourhoods
                are well-lit at night, which spots have high foot traffic for safety in numbers, and which
                to genuinely avoid.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, label: 'Crime-rate overlays by neighbourhood', color: '#22c55e' },
                  { icon: Eye, label: 'Lighting quality scores', color: '#06b6d4' },
                  { icon: Users, label: 'Foot traffic patterns by hour', color: '#8b5cf6' },
                  { icon: Navigation, label: 'Fastest & safest route combined', color: '#f59e0b' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-white/70 text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Safety map card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass rounded-2xl p-6 border border-emerald-500/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-white/80">Area Safety Overview</span>
                  <Badge variant="safe" dot>Live</Badge>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Hauz Khas Village', level: 'safe', score: 92 },
                    { name: 'Lodhi Garden', level: 'safe', score: 96 },
                    { name: 'Saket SCW', level: 'safe', score: 88 },
                    { name: 'Connaught Place', level: 'moderate', score: 64 },
                    { name: 'Paharganj', level: 'danger', score: 31 },
                  ].map((area) => (
                    <div key={area.name} className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background: area.level === 'safe' ? '#22c55e' : area.level === 'moderate' ? '#f59e0b' : '#ef4444',
                        }}
                      />
                      <span className="flex-1 text-sm text-white/65">{area.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${area.score}%`,
                              background: area.level === 'safe' ? '#22c55e' : area.level === 'moderate' ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/40 w-6">{area.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Vibe section ── */}
      <section id="vibes" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="accent" className="mb-4">Find Your Tribe</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Places tagged for{' '}
              <span className="text-cyan-400">who you are,</span>
              <br />not who they think you are.
            </h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto mb-12">
              Introvert? Extrovert? Solo explorer? We tag areas so you feel seen — never judged.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {[
              { label: 'Introvert Spots', color: '#8b5cf6', icon: Coffee },
              { label: 'Social Hubs', color: '#ec4899', icon: Users },
              { label: 'Safe for Women', color: '#22c55e', icon: Heart },
              { label: 'Dog Friendly', color: '#f59e0b', icon: Star },
              { label: 'Night Owl Safe', color: '#06b6d4', icon: Eye },
              { label: 'Budget Friendly', color: '#a78bfa', icon: Zap },
              { label: 'First Date Spots', color: '#f43f5e', icon: Heart },
              { label: 'Commuter Friendly', color: '#3b82f6', icon: Navigation },
            ].map(({ label, color, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border"
                style={{
                  color,
                  borderColor: `${color}25`,
                  background: `${color}10`,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fluid canvas section ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              Hover to feel the flow
            </h2>
            <p className="text-white/40 text-sm">Interactive fluid simulation — your cursor controls the energy.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <FluidCanvas width={800} height={300} className="w-full max-w-3xl" />
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <QmapTextEffect speed={0.8} className="text-purple-300" />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to explore
              <br />
              <span className="text-purple-400">smarter?</span>
            </h2>
            <p className="text-white/50 text-lg mb-10">
              No account. No ads. No gatekeeping.
              Just the truth about where you're heading.
            </p>
            <Button size="lg" onClick={() => navigate('/map')} className="text-base px-8 py-4 glow-purple">
              <MapPin className="w-5 h-5" />
              Open Qmap — It's Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/25">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white/40">Qmap</span>
            <span>— Know before you go</span>
          </div>
          <span>Built for every explorer. Zero bias. Full respect.</span>
        </div>
      </footer>
    </div>
  )
}
