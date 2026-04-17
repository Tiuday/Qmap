import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Users, Zap, MapPin, Navigation, Clock,
  TrendingUp, Eye, Heart, ArrowRight, Star, ChevronDown,
  Lock, Wifi, Coffee,
} from 'lucide-react'
import { QmapTextEffect } from '@/components/ui/text-effect'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ── Floating location ping ──────────────────────────────────
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.5 }}
      className="group glass rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
        style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <h3 className="text-base font-semibold text-white/90 mb-3">{title}</h3>
      <p className="text-sm text-white/45 leading-relaxed">{description}</p>
    </motion.div>
  )
}

// ── Section eyebrow ──────────────────────────────────────────
function SectionLabel({ number, label, color = 'rgba(139,92,246,0.5)' }: { number: string; label: string; color?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-20">
      <div
        className="flex-1 h-px max-w-[80px]"
        style={{ background: `linear-gradient(to left, ${color}, transparent)` }}
      />
      <span
        className="text-xs font-mono tracking-[0.25em] uppercase"
        style={{ color }}
      >
        {number} / {label}
      </span>
      <div
        className="flex-1 h-px max-w-[80px]"
        style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
      />
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

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

          <div className="hidden md:flex items-center gap-6 text-sm text-white/50 font-medium">
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

      {/* ──────────────────────────────────────────────────────────
          SECTION 1 · HERO — Map fills the entire viewport
      ────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Full-bleed fake map background */}
        <div className="absolute inset-0 bg-[#0b0b12]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" style={{ top: '5%', left: '40%' }} />
          <div className="absolute w-72 h-72 rounded-full bg-fuchsia-500/15 blur-[90px]" style={{ top: '45%', left: '62%' }} />
          <div className="absolute w-56 h-56 rounded-full bg-purple-800/15 blur-[70px]" style={{ top: '20%', left: '28%' }} />
          <div className="absolute w-40 h-40 rounded-full bg-amber-500/10 blur-[60px]" style={{ top: '65%', left: '52%' }} />
          <div className="absolute w-36 h-36 rounded-full bg-cyan-500/08 blur-[50px]" style={{ top: '72%', left: '78%' }} />
        </div>

        {/* Scan line */}
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent pointer-events-none z-10"
          animate={{ top: ['5%', '95%', '5%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Location pings */}
        <LocationPing x={55} y={18} color="#8b5cf6" label="Busy — CP" delay={1.3} />
        <LocationPing x={68} y={40} color="#22c55e" label="Safe — HKV" delay={1.6} />
        <LocationPing x={75} y={58} color="#f59e0b" label="Moderate" delay={1.9} />
        <LocationPing x={82} y={25} color="#ef4444" label="High Traffic" delay={2.2} />
        <LocationPing x={62} y={70} color="#06b6d4" label="Chill Zone" delay={2.5} />

        {/* Gradient masks — full overlay so centred text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090f]/90 via-[#09090f]/70 to-[#09090f]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/30 to-transparent pointer-events-none" />

        {/* HUD — top right */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
          className="absolute top-24 right-5 z-20 flex flex-col gap-2 items-end"
        >
          <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
            <MapPin className="w-3 h-3 text-purple-400" />
            <span className="text-white/55">Delhi, India</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex gap-1.5">
            <div className="glass rounded-lg px-2.5 py-1 text-xs text-purple-300 border border-purple-500/20">Crowd</div>
            <div className="glass rounded-lg px-2.5 py-1 text-xs text-emerald-300 border border-emerald-500/20">Safety</div>
            <div className="glass rounded-lg px-2.5 py-1 text-xs text-amber-300 border border-amber-500/20">Traffic</div>
          </div>
        </motion.div>

        {/* HUD — bottom right */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="absolute bottom-28 right-5 z-20 glass rounded-xl p-3"
        >
          <div className="text-xs text-white/30 mb-1.5">Crowd Density</div>
          <div className="flex items-center gap-1">
            {['#1a0030', '#4a148c', '#7b1fa2', '#aa00ff', '#e040fb'].map((c, i) => (
              <div key={i} className="w-6 h-2 rounded-sm" style={{ background: c }} />
            ))}
            <span className="text-xs text-white/20 ml-1">Max</span>
          </div>
        </motion.div>

        {/* Hero text — centred */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-20 z-10 text-center">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 text-sm font-medium text-purple-300 mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Real-time city intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-7"
          >
            Know the vibe
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent glow-text-purple">
              before you go.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.6 }}
            className="text-lg text-white/45 max-w-lg mb-12 leading-relaxed"
          >
            Crowd density, safety scores, traffic flow, and area vibes —{' '}
            live on one gorgeous dark map.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68 }}
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
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 z-20"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ── Section gap ── */}
      <div className="section-gap" />

      {/* ──────────────────────────────────────────────────────────
          SECTION 2 · STATS — Horizontal strip
      ────────────────────────────────────────────────────────── */}
      <section className="bg-[#111118] border-y border-white/[0.06] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/[0.06]">
            {[
              { value: '50+', label: 'Areas mapped', icon: MapPin },
              { value: 'Live', label: 'Real-time data', icon: Wifi },
              { value: '0 bias', label: 'Verified inclusive', icon: Heart },
              { value: 'Free', label: 'Always & forever', icon: Star },
            ].map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center px-8 py-4"
              >
                <Icon className="w-4 h-4 text-purple-400/50 mb-4" />
                <div className="text-2xl font-bold text-white mb-1.5">{value}</div>
                <div className="text-xs text-white/30 uppercase tracking-widest">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section gap ── */}
      <div className="section-gap" />

      {/* ──────────────────────────────────────────────────────────
          SECTION 3 · FEATURES
      ────────────────────────────────────────────────────────── */}
      <section id="features" className="relative py-32 px-6 bg-[#09090f]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="max-w-6xl mx-auto relative">
          <SectionLabel number="01" label="Features" color="rgba(139,92,246,0.5)" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Everything Google Maps{' '}
              <span className="text-white/20">won't</span>{' '}
              <span className="text-purple-400">tell you.</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed">
              We built what you actually need before stepping out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon={Users} title="Live Crowd Density" description="Purple heatmap shows exactly how packed an area is right now — from empty to absolutely crammed." accent="#8b5cf6" delay={0} />
            <FeatureCard icon={Shield} title="Safety Score" description="Green, yellow, red zones based on crime data, lighting, and community reports. Know before you go." accent="#22c55e" delay={0.07} />
            <FeatureCard icon={TrendingUp} title="Traffic Heatmap" description="See which roads are choked and which are clear. Pick the fastest path, not just the shortest." accent="#f59e0b" delay={0.14} />
            <FeatureCard icon={Clock} title="Open or Closed" description="Real-time status for markets, parks, malls, and venues. Never show up to a locked gate again." accent="#06b6d4" delay={0.21} />
            <FeatureCard icon={Navigation} title="Locality Shortcuts" description="Hidden local routes that only locals know. Faster paths from your exact neighbourhood." accent="#ec4899" delay={0.28} />
            <FeatureCard icon={Heart} title="Vibe Matching" description="Areas tagged for introverts, extroverts, solo women, couples, and more — zero bias, all belonging." accent="#f43f5e" delay={0.35} />
          </div>
        </div>
      </section>

      {/* ── Section gap ── */}
      <div className="section-gap" />

      {/* ──────────────────────────────────────────────────────────
          SECTION 4 · SAFETY
      ────────────────────────────────────────────────────────── */}
      <section id="safety" className="relative py-32 px-6 bg-[#0d0d16]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(34,197,94,0.04),transparent)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <SectionLabel number="02" label="Safety" color="rgba(34,197,94,0.45)" />

          {/* Safety heading — centred */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Built especially for{' '}
              <span className="text-emerald-400">women</span>
              {' '}and{' '}
              <span className="text-purple-400">solo travellers.</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed">
              Real safety data — not averages. Which neighbourhoods are well-lit at night,
              which spots have foot traffic for safety in numbers, and which to genuinely avoid.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-14 items-start max-w-5xl mx-auto">

            {/* Safety checklist — centred */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="space-y-5 w-full max-w-sm">
                {[
                  { icon: Shield, label: 'Crime-rate overlays by neighbourhood', color: '#22c55e' },
                  { icon: Eye, label: 'Lighting quality scores', color: '#06b6d4' },
                  { icon: Users, label: 'Foot traffic patterns by hour', color: '#8b5cf6' },
                  { icon: Navigation, label: 'Fastest & safest route combined', color: '#f59e0b' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${color}18`, border: `1px solid ${color}25` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-white/55 text-sm text-left">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Safety overview card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass rounded-2xl p-8 border border-emerald-500/10">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-semibold text-white/65">Area Safety Overview</span>
                  <Badge variant="safe" dot>Live</Badge>
                </div>

                <div className="space-y-6">
                  {[
                    { name: 'Hauz Khas Village', level: 'safe', score: 92 },
                    { name: 'Lodhi Garden', level: 'safe', score: 96 },
                    { name: 'Saket SCW', level: 'safe', score: 88 },
                    { name: 'Connaught Place', level: 'moderate', score: 64 },
                    { name: 'Paharganj', level: 'danger', score: 31 },
                  ].map((area) => {
                    const color = area.level === 'safe' ? '#22c55e' : area.level === 'moderate' ? '#f59e0b' : '#ef4444'
                    return (
                      <div key={area.name} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                        <span className="flex-1 text-sm text-white/55">{area.name}</span>
                        <div className="flex items-center gap-2.5">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${area.score}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                              style={{ background: color }}
                            />
                          </div>
                          <span className="text-xs text-white/30 w-6 tabular-nums">{area.score}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-500/06 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section gap ── */}
      <div className="section-gap" />

      {/* ──────────────────────────────────────────────────────────
          SECTION 5 · VIBES
      ────────────────────────────────────────────────────────── */}
      <section id="vibes" className="relative py-32 px-6 bg-[#111118]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(6,182,212,0.04),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <SectionLabel number="03" label="Vibes" color="rgba(6,182,212,0.45)" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Places tagged for{' '}
              <span className="text-cyan-400">who you are,</span>
              <br />not who they think you are.
            </h2>
            <p className="text-white/40 text-lg leading-relaxed">
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
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border cursor-default select-none"
                style={{ color, borderColor: `${color}22`, background: `${color}0d` }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section gap ── */}
      <div className="section-gap" />

      {/* ──────────────────────────────────────────────────────────
          SECTION 6 · CTA
      ────────────────────────────────────────────────────────── */}
      <section className="relative py-48 px-6 bg-[#09090f] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(139,92,246,0.10),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-10">
              <QmapTextEffect speed={0.8} className="text-purple-300" />
            </div>

            <h2 className="text-5xl md:text-7xl font-bold text-white mb-7 leading-tight">
              Ready to explore
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                smarter?
              </span>
            </h2>

            <p className="text-white/35 text-xl mb-14 leading-relaxed">
              No account. No ads. No gatekeeping.
              <br />Just the truth about where you're heading.
            </p>

            <Button
              size="lg"
              onClick={() => navigate('/map')}
              className="text-base px-10 glow-purple"
            >
              <MapPin className="w-5 h-5" />
              Open Qmap — It's Free
              <ArrowRight className="w-5 h-5" />
            </Button>

            <div className="mt-12 flex items-center justify-center gap-8 text-xs text-white/18">
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" />No sign-up needed</span>
              <span className="flex items-center gap-1.5"><Wifi className="w-3 h-3" />Live data</span>
              <span className="flex items-center gap-1.5"><Star className="w-3 h-3" />100% free</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-12 px-6 bg-[#09090f]">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-sm text-white/18 text-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white/30">Qmap</span>
            <span>— Know before you go</span>
          </div>
          <span>Built for every explorer. Zero bias. Full respect.</span>
        </div>
      </footer>

    </div>
  )
}
