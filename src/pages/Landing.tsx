import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Users, Zap, MapPin, Navigation, Clock,
  TrendingUp, Eye, Heart, ArrowRight, Star, ChevronDown,
  Lock, Wifi, Coffee, Sparkles,
} from 'lucide-react'
import { QmapTextEffect } from '@/components/ui/text-effect'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Pulsing map ping with animated label */
function LocationPing({
  x, y, color, label, delay,
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
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: color }}
          animate={{ scale: [1, 3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
        />
        <div
          className="w-3 h-3 rounded-full border-2 border-white/80 shadow-lg relative z-10"
          style={{ background: color }}
        />
        <motion.div
          className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap glass px-2.5 py-1 rounded-full text-xs font-semibold"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.4 }}
        >
          {label}
        </motion.div>
      </div>
    </motion.div>
  )
}

/** Feature card — centred, animated on scroll */
function FeatureCard({
  icon: Icon, title, description, accent, delay,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  title: string
  description: string
  accent: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group glass rounded-3xl p-10 flex flex-col items-center text-center
                 hover:border-white/15 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Subtle glow bloom on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}10, transparent 70%)` }}
      />

      {/* Icon */}
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 relative"
        style={{ background: `${accent}15`, border: `1.5px solid ${accent}30` }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <Icon className="w-6 h-6" style={{ color: accent }} />
        {/* shimmer ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ border: `1.5px solid ${accent}` }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: delay + 0.5 }}
        />
      </motion.div>

      <h3 className="text-lg font-bold text-white mb-4 leading-snug">{title}</h3>
      <p className="text-sm text-white/45 leading-[1.85] max-w-[22ch] mx-auto">{description}</p>
    </motion.div>
  )
}

/** Centred eyebrow label with decorative lines */
function SectionLabel({
  number, label, color = 'rgba(139,92,246,0.55)',
}: { number: string; label: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-center gap-5 mb-14"
    >
      <div className="h-px w-16" style={{ background: `linear-gradient(to left, ${color}, transparent)` }} />
      <span className="text-[11px] font-mono tracking-[0.3em] uppercase" style={{ color }}>
        {number} / {label}
      </span>
      <div className="h-px w-16" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
    </motion.div>
  )
}

/** Safety checklist row — fully centred */
function SafetyRow({
  icon: Icon, label, color, delay,
}: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45 }}
      className="flex flex-col items-center gap-3 text-center"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}18`, border: `1.5px solid ${color}28` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span className="text-white/60 text-sm font-medium leading-snug max-w-[14ch]">{label}</span>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#09090f] overflow-x-hidden">

      {/* ── Navbar ───────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between glass rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Qmap</span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-white/45 font-medium">
            <a href="#features" className="hover:text-white/90 transition-colors duration-200">Features</a>
            <a href="#safety" className="hover:text-white/90 transition-colors duration-200">Safety</a>
            <a href="#vibes" className="hover:text-white/90 transition-colors duration-200">Vibes</a>
          </div>

          <Button size="sm" onClick={() => navigate('/map')}>
            Open Map <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 · HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">

        {/* Map grid background */}
        <div className="absolute inset-0 bg-[#0b0b12]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        {/* Ambient blobs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/18 blur-[130px] pointer-events-none"
          style={{ top: '0%', left: '35%' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.25, 0.18] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-fuchsia-500/12 blur-[100px] pointer-events-none"
          style={{ top: '50%', left: '65%' }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        <div className="absolute w-56 h-56 rounded-full bg-cyan-500/08 blur-[80px] pointer-events-none" style={{ top: '70%', left: '75%' }} />

        {/* Animated scan line */}
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none z-10"
          animate={{ top: ['4%', '96%', '4%'] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
        />

        {/* Location pings */}
        <LocationPing x={56} y={16} color="#8b5cf6" label="Busy — CP"     delay={1.3} />
        <LocationPing x={70} y={38} color="#22c55e" label="Safe — HKV"    delay={1.7} />
        <LocationPing x={78} y={56} color="#f59e0b" label="Moderate"      delay={2.1} />
        <LocationPing x={84} y={24} color="#ef4444" label="High Traffic"  delay={2.5} />
        <LocationPing x={64} y={68} color="#06b6d4" label="Chill Zone"    delay={2.9} />

        {/* Dark overlay — ensures centred text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090f]/60 via-[#09090f]/55 to-[#09090f]   pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090f]/70 via-transparent to-transparent pointer-events-none" />

        {/* HUD — top right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute top-24 right-5 z-20 flex flex-col gap-2 items-end"
        >
          <div className="glass rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
            <MapPin className="w-3 h-3 text-purple-400" />
            <span className="text-white/55">Delhi, India</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex gap-1.5">
            {[
              { label: 'Crowd',   cls: 'text-purple-300 border-purple-500/20' },
              { label: 'Safety',  cls: 'text-emerald-300 border-emerald-500/20' },
              { label: 'Traffic', cls: 'text-amber-300   border-amber-500/20' },
            ].map(({ label, cls }) => (
              <div key={label} className={`glass rounded-lg px-2.5 py-1 text-xs border ${cls}`}>{label}</div>
            ))}
          </div>
        </motion.div>

        {/* HUD — bottom right: density legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6 }}
          className="absolute bottom-28 right-5 z-20 flex flex-col gap-2 items-end"
        >
          {/* Safety legend */}
          <div className="glass rounded-2xl px-4 py-3">
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Safety Zones</div>
            <div className="flex flex-col gap-1.5">
              {[
                { color: '#22c55e', label: 'Safe' },
                { color: '#f59e0b', label: 'Moderate' },
                { color: '#ef4444', label: 'Use Caution' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-[10px] text-white/45">{label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Crowd density legend */}
          <div className="glass rounded-2xl p-4">
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Crowd Density</div>
            <div className="flex items-center gap-1.5">
              {['#1a0030', '#4a148c', '#7b1fa2', '#aa00ff', '#e040fb'].map((c, i) => (
                <div key={i} className="w-7 h-2.5 rounded" style={{ background: c }} />
              ))}
              <span className="text-[10px] text-white/20 ml-1">Max</span>
            </div>
          </div>
        </motion.div>

        {/* ── Hero text — centred ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-16 z-10 text-center">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 glass-purple rounded-full px-5 py-2.5 mb-10"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-purple-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span className="text-sm font-semibold text-purple-200 tracking-wide">Real-time city intelligence</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-tight mb-8"
          >
            Know the{' '}
            <span className="relative inline-block">
              <span className="text-highlight-purple">vibe</span>
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent glow-text-purple animate-gradient-slow">
              before you go.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.7 }}
            className="text-xl text-white/50 max-w-xl mb-14 leading-[1.75]"
          >
            <span className="text-white/80 font-medium">Crowd density</span>,{' '}
            <span className="text-white/80 font-medium">safety scores</span>,{' '}
            <span className="text-white/80 font-medium">traffic flow</span>, and{' '}
            <span className="text-white/80 font-medium">area vibes</span>{' '}
            — live on one gorgeous dark map.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.74, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" onClick={() => navigate('/map')} className="group glow-purple px-8">
              <MapPin className="w-5 h-5" />
              Explore the Map
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button size="lg" variant="secondary" className="px-8">
              <Eye className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 z-20"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 · STATS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#111118] border-y border-white/[0.06] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '50+',    label: 'Areas mapped',       sub: 'across Delhi NCR',   icon: MapPin,  color: '#8b5cf6' },
              { value: 'Live',   label: 'Real-time data',     sub: 'updated every min',  icon: Wifi,    color: '#06b6d4' },
              { value: '0 bias', label: 'Verified inclusive', sub: 'for every identity', icon: Heart,   color: '#ec4899' },
              { value: 'Free',   label: 'Always & forever',   sub: 'no account needed',  icon: Star,    color: '#f59e0b' },
            ].map(({ value, label, sub, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center px-6 py-8
                           border-r border-white/[0.06] last:border-r-0
                           [&:nth-child(2)]:border-r-white/[0.06]"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <div
                  className="text-3xl font-bold mb-2 tracking-tight"
                  style={{ color }}
                >
                  {value}
                </div>
                <div className="text-sm font-semibold text-white/70 mb-1">{label}</div>
                <div className="text-xs text-white/25 tracking-wide">{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 · FEATURES
      ══════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-40 px-6 bg-[#09090f]">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.025)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />
        {/* Ambient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <SectionLabel number="01" label="Features" color="rgba(139,92,246,0.6)" />

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-7">
              Everything Google Maps{' '}
              <span className="text-white/20 italic">won't</span>{' '}
              <span className="text-highlight-purple">tell you.</span>
            </h2>
            <p className="text-white/45 text-xl leading-[1.8]">
              We built what you{' '}
              <span className="text-white/80 font-semibold">actually need</span>{' '}
              before stepping out — no guessing, no surprises.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Users}
              title="Live Crowd Density"
              description="Purple heatmap shows exactly how packed an area is right now — from empty to absolutely crammed."
              accent="#8b5cf6" delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Safety Score"
              description="Green, yellow, red zones based on crime data, lighting, and community reports. Know before you go."
              accent="#22c55e" delay={0.08}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Traffic Heatmap"
              description="See which roads are choked and which are clear. Pick the fastest path, not just the shortest."
              accent="#f59e0b" delay={0.16}
            />
            <FeatureCard
              icon={Clock}
              title="Open or Closed"
              description="Real-time status for markets, parks, malls, and venues. Never show up to a locked gate again."
              accent="#06b6d4" delay={0.24}
            />
            <FeatureCard
              icon={Navigation}
              title="Locality Shortcuts"
              description="Hidden local routes that only locals know. Faster paths from your exact neighbourhood."
              accent="#ec4899" delay={0.32}
            />
            <FeatureCard
              icon={Heart}
              title="Vibe Matching"
              description="Areas tagged for introverts, extroverts, solo women, couples, and more — zero bias, all belonging."
              accent="#f43f5e" delay={0.40}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 · SAFETY
      ══════════════════════════════════════════════════════ */}
      <section id="safety" className="relative py-40 px-6 bg-[#0d0d16]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(34,197,94,0.045),transparent)] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <SectionLabel number="02" label="Safety" color="rgba(34,197,94,0.55)" />

          {/* Heading — fully centred */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-[1.12] mb-8">
              Built especially for{' '}
              <span className="text-highlight-green">women</span>
              {' '}and{' '}
              <span className="text-highlight-purple">solo travellers.</span>
            </h2>
            <p className="text-white/45 text-xl leading-[1.8]">
              Real safety data — not averages. Know which neighbourhoods are{' '}
              <span className="text-white/75 font-medium">well-lit at night</span>,
              which spots have{' '}
              <span className="text-white/75 font-medium">safety in numbers</span>,
              and which to{' '}
              <span className="text-red-400/80 font-medium">genuinely avoid</span>.
            </p>
          </motion.div>

          {/* Safety checklist — 4-across centred grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-3xl mx-auto">
            <SafetyRow icon={Shield}     label="Crime-rate overlays by neighbourhood" color="#22c55e" delay={0} />
            <SafetyRow icon={Eye}        label="Lighting quality scores"               color="#06b6d4" delay={0.1} />
            <SafetyRow icon={Users}      label="Foot traffic patterns by hour"         color="#8b5cf6" delay={0.2} />
            <SafetyRow icon={Navigation} label="Fastest & safest route combined"       color="#f59e0b" delay={0.3} />
          </div>

          {/* Safety overview card — centred */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl mx-auto relative"
          >
            <div className="glass rounded-3xl p-10 border border-emerald-500/12">
              <div className="flex items-center justify-between mb-10">
                <span className="text-base font-bold text-white/75">Area Safety Overview</span>
                <Badge variant="safe" dot>Live</Badge>
              </div>

              <div className="space-y-7">
                {[
                  { name: 'Hauz Khas Village', level: 'safe',     score: 92 },
                  { name: 'Lodhi Garden',       level: 'safe',     score: 96 },
                  { name: 'Saket SCW',          level: 'safe',     score: 88 },
                  { name: 'Connaught Place',    level: 'moderate', score: 64 },
                  { name: 'Paharganj',          level: 'danger',   score: 31 },
                ].map((area) => {
                  const color = area.level === 'safe' ? '#22c55e'
                              : area.level === 'moderate' ? '#f59e0b'
                              : '#ef4444'
                  return (
                    <div key={area.name} className="flex items-center gap-4">
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: color }}
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                      />
                      <span className="flex-1 text-sm text-white/60 font-medium">{area.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-28 h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${area.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{ background: `linear-gradient(to right, ${color}80, ${color})` }}
                          />
                        </div>
                        <span
                          className="text-xs font-bold w-6 tabular-nums text-right"
                          style={{ color }}
                        >
                          {area.score}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Glow behind card */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/08 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 · VIBES
      ══════════════════════════════════════════════════════ */}
      <section id="vibes" className="relative py-40 px-6 bg-[#111118]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(6,182,212,0.05),transparent_55%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <SectionLabel number="03" label="Vibes" color="rgba(6,182,212,0.55)" />

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-[1.12] mb-8">
              Places tagged for{' '}
              <span className="text-highlight-cyan">who you are,</span>
              <br />
              <span className="text-white/35">not who they think you are.</span>
            </h2>
            <p className="text-white/45 text-xl leading-[1.8]">
              Introvert? Extrovert? Solo explorer?{' '}
              <span className="text-white/75 font-medium">We tag areas so you feel seen</span>{' '}
              — never judged.
            </p>
          </motion.div>

          {/* Vibe tags */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Introvert Spots',    color: '#8b5cf6', icon: Coffee   },
              { label: 'Social Hubs',        color: '#ec4899', icon: Users    },
              { label: 'Safe for Women',     color: '#22c55e', icon: Heart    },
              { label: 'Dog Friendly',       color: '#f59e0b', icon: Star     },
              { label: 'Night Owl Safe',     color: '#06b6d4', icon: Eye      },
              { label: 'Budget Friendly',    color: '#a78bfa', icon: Zap      },
              { label: 'First Date Spots',   color: '#f43f5e', icon: Heart    },
              { label: 'Commuter Friendly',  color: '#3b82f6', icon: Navigation },
            ].map(({ label, color, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8, y: 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.06, y: -3, transition: { duration: 0.2 } }}
                className="flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold border cursor-default select-none"
                style={{
                  color,
                  borderColor: `${color}28`,
                  background: `${color}0e`,
                  boxShadow: `0 0 20px ${color}08`,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 · CTA
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-52 px-6 bg-[#09090f] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />

        {/* Pulsing orb */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <motion.div
            className="w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.025)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Draw-on logo */}
            <div className="mb-12">
              <QmapTextEffect speed={0.8} className="text-purple-300" />
            </div>

            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.08]">
              Ready to explore
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent glow-text-purple animate-gradient-slow">
                smarter?
              </span>
            </h2>

            <p className="text-white/40 text-2xl mb-16 leading-[1.75] max-w-lg">
              <span className="text-white/70 font-semibold">No account.</span>{' '}
              <span className="text-white/70 font-semibold">No ads.</span>{' '}
              <span className="text-white/70 font-semibold">No gatekeeping.</span>
              <br />
              Just the truth about where you're heading.
            </p>

            <Button
              size="lg"
              onClick={() => navigate('/map')}
              className="text-lg px-12 py-4 glow-purple group"
            >
              <MapPin className="w-5 h-5" />
              Open Qmap — It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>

            {/* Trust strip */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-white/22">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                No sign-up needed
              </span>
              <span className="w-px h-4 bg-white/10" />
              <span className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5" />
                Live data
              </span>
              <span className="w-px h-4 bg-white/10" />
              <span className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5" />
                100% free
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-14 px-6 bg-[#09090f]">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white/40 text-lg tracking-tight">Qmap</span>
          </div>
          <p className="text-sm text-white/20 leading-relaxed">
            Know before you go.
          </p>
          <p className="text-xs text-white/12 tracking-wide">
            Built for every explorer. Zero bias. Full respect.
          </p>
        </div>
      </footer>

    </div>
  )
}
