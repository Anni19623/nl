import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// ── Floating Orb cursor ────────────────────────────────────────────────────
function CursorOrb() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <motion.div
      animate={{ x: pos.x - 200, y: pos.y - 200 }}
      transition={{ type: 'spring', stiffness: 80, damping: 22, mass: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: 400, height: 400,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  );
}

// ── Neural particle canvas ─────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const N = 55;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.35)';
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

// ── Scroll progress bar ────────────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div style={{
      scaleX, transformOrigin: 'left',
      position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999,
      background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
    }} />
  );
}

// ── Magnetic Button ────────────────────────────────────────────────────────
function MagButton({ children, onClick, primary, style = {} }) {
  const ref = useRef(null);
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    setDelta({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25 });
  };
  const onLeave = () => setDelta({ x: 0, y: 0 });
  return (
    <motion.button
      ref={ref}
      animate={{ x: delta.x, y: delta.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      whileTap={{ scale: 0.96 }}
      style={{
        padding: '14px 32px', borderRadius: 14, fontWeight: 700, fontSize: 15,
        cursor: 'pointer', border: 'none', letterSpacing: '-0.2px',
        fontFamily: 'inherit',
        ...(primary ? {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
        } : {
          background: 'rgba(255,255,255,0.7)',
          color: '#1e1b4b',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(99,102,241,0.15)',
        }),
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

// ── Glass Card ─────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: '0 24px 64px rgba(99,102,241,0.15)' }}
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 8px 32px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        padding: 28,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Stat Counter ───────────────────────────────────────────────────────────
function StatCard({ value, label, icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
        padding: '28px 24px',
        textAlign: 'center',
        flex: 1, minWidth: 160,
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: 6,
      }}>{value}</div>
      <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, lineHeight: 1.4 }}>{label}</div>
    </motion.div>
  );
}

// ── Mode Preview Card ──────────────────────────────────────────────────────
const MODE_CARDS = [
  { key: 'adhd',      emoji: '⚡', label: 'ADHD Mode',      desc: 'Gamified micro-tasks with XP rewards', color: '#f59e0b', bg: '#fffbeb', pos: { top: '8%',  left: '-6%'  } },
  { key: 'dyslexia',  emoji: '📖', label: 'Dyslexia Mode',  desc: 'Lexend font, syllable bands, TTS',      color: '#6366f1', bg: '#eef2ff', pos: { top: '8%',  right: '-6%' } },
  { key: 'autism',    emoji: '📋', label: 'Autism Mode',    desc: 'Structured facts, zero ambiguity',      color: '#10b981', bg: '#ecfdf5', pos: { bottom: '8%', left: '-6%'  } },
  { key: 'narrative', emoji: '✨', label: 'Narrative Mode', desc: 'Story-driven concept exploration',      color: '#8b5cf6', bg: '#f5f3ff', pos: { bottom: '8%', right: '-6%' } },
];

function FloatingModeCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute', ...card.pos,
        background: card.bg,
        border: `1px solid ${card.color}22`,
        borderRadius: 16,
        padding: '14px 18px',
        boxShadow: `0 8px 32px ${card.color}18`,
        minWidth: 180, zIndex: 2,
        backdropFilter: 'blur(12px)',
      }}
      animate={{
        y: [0, index % 2 === 0 ? -8 : 8, 0],
      }}
      transition={{
        y: { duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' },
        opacity: { duration: 0.6, delay: 0.8 + index * 0.15 },
        scale: { duration: 0.6, delay: 0.8 + index * 0.15 },
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${card.color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>{card.emoji}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', letterSpacing: '-0.2px' }}>{card.label}</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>{card.desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Dashboard Mockup ───────────────────────────────────────────────────────
function DashboardMockup() {
  const students = [
    { name: 'Arjun S.',   mode: 'ADHD',      prog: 85, color: '#f59e0b' },
    { name: 'Priya N.',   mode: 'Dyslexia',  prog: 62, color: '#6366f1' },
    { name: 'Rahul V.',   mode: 'Autism',    prog: 91, color: '#10b981' },
    { name: 'Sneha I.',   mode: 'Narrative', prog: 44, color: '#8b5cf6' },
    { name: 'Karan M.',   mode: 'ADHD',      prog: 73, color: '#f59e0b' },
  ];
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(24px)',
      borderRadius: 24,
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 32px 80px rgba(99,102,241,0.18)',
      overflow: 'hidden', width: '100%', maxWidth: 560,
    }}>
      {/* Titlebar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
        ))}
        <div style={{
          marginLeft: 12, fontSize: 12, color: 'rgba(255,255,255,0.7)',
          fontWeight: 600, letterSpacing: '0.05em',
        }}>NeuroLearn · Educator Dashboard</div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Mini stat row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Students', val: '32', icon: '👥' },
            { label: 'Active',   val: '28', icon: '🟢' },
            { label: 'Avg',      val: '71%', icon: '📈' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: 'rgba(99,102,241,0.06)',
              borderRadius: 12, padding: '10px 12px',
              border: '1px solid rgba(99,102,241,0.1)',
            }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.5px' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Student rows */}
        {students.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.08 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < students.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: `${s.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: s.color, flexShrink: 0,
            }}>{s.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b', marginBottom: 3 }}>{s.name}</div>
              <div style={{ background: '#f3f4f6', borderRadius: 999, height: 4 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: s.prog + '%' }}
                  transition={{ delay: 1.4 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
                  style={{ background: s.color, height: 4, borderRadius: 999 }}
                />
              </div>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 8px',
              borderRadius: 999, background: `${s.color}18`, color: s.color,
              flexShrink: 0,
            }}>{s.mode}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', flexShrink: 0 }}>{s.prog}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── FEATURE DATA ───────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🧠', title: 'AI Transformation Engine', desc: 'Upload any textbook or syllabus. Our AI instantly produces 4 neuro-specific versions — simultaneously, in seconds.', color: '#6366f1' },
  { icon: '⚡', title: 'ADHD Gamified Mode', desc: 'Content split into micro-tasks with XP rewards, progress bars, and dopamine-friendly checkpoints.', color: '#f59e0b' },
  { icon: '📖', title: 'Dyslexia Reader', desc: 'Lexend font, syllable colour-banding, adjustable spacing, coloured overlays and word-tap TTS.', color: '#3b82f6' },
  { icon: '📋', title: 'Autism Structured Mode', desc: 'Zero metaphors. Predictable layouts. Abstract content rewritten as numbered, literal rule-based facts.', color: '#10b981' },
  { icon: '✨', title: 'Narrative Story Mode', desc: 'Every concept becomes a story. Characters, dialogue, quests — learning that feels like reading a novel.', color: '#8b5cf6' },
  { icon: '📊', title: 'District Dashboard', desc: 'Educators see every student\'s mode, progress, and engagement — and can override profiles in one click.', color: '#ec4899' },
];

// ── MAIN LANDING PAGE ──────────────────────────────────────────────────────
export default function Landing({ onTeacher, onStudent }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpa = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
      background: 'linear-gradient(160deg, #f8f7ff 0%, #f0f4ff 40%, #faf5ff 100%)',
      color: '#1e1b4b', overflowX: 'hidden', minHeight: '100vh',
    }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <ScrollBar />
      <CursorOrb />

      {/* ── STICKY NAV ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, width: 'calc(100% - 48px)', maxWidth: 900,
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(20px)',
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}>🧠</div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px', color: '#1e1b4b' }}>
            NeuroLearn
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <MagButton onClick={onTeacher}>👩‍🏫 Teacher Login</MagButton>
          <MagButton onClick={onStudent} primary>👨‍🎓 Student Login</MagButton>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: 100,
      }}>
        <NeuralCanvas />

        {/* Gradient orbs */}
        {[
          { top: '10%', left: '5%',  size: 500, colors: 'rgba(99,102,241,0.12), transparent' },
          { top: '50%', right: '3%', size: 400, colors: 'rgba(139,92,246,0.10), transparent' },
          { bottom: '10%', left: '40%', size: 350, colors: 'rgba(6,182,212,0.08), transparent' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute', ...orb,
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.colors})`,
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpa, position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 900, width: '100%' }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 999, padding: '8px 18px', marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI-Powered Neuro-Inclusive Education
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(44px, 7vw, 80px)',
              fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.05,
              margin: '0 0 24px', color: '#1e1b4b',
            }}
          >
            Adaptive Learning<br />
            for <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Every Mind.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              fontSize: 18, color: '#6b7280', maxWidth: 560, margin: '0 auto 48px',
              lineHeight: 1.7, fontWeight: 400,
            }}
          >
            Upload any lesson. NeuroLearn's AI instantly transforms it into personalized formats for ADHD, Dyslexia, Autism Spectrum, and Narrative learners — in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}
          >
            <MagButton onClick={onTeacher} style={{ padding: '16px 36px', fontSize: 16 }}>
              👩‍🏫 Teacher Login
            </MagButton>
            <MagButton onClick={onStudent} primary style={{ padding: '16px 36px', fontSize: 16 }}>
              👨‍🎓 Student Login →
            </MagButton>
          </motion.div>

          {/* Dashboard + floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: 560 }}
          >
            {MODE_CARDS.map((card, i) => <FloatingModeCard key={card.key} card={card} index={i} />)}
            <DashboardMockup />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '100px 24px', maxWidth: 960, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
            The scale of the problem
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
            Neurodivergent students don't struggle because of their minds. They struggle because of their tools.
          </p>
        </motion.div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <StatCard value="1 in 7"  label="People globally are neurodivergent"                  icon="🌍" delay={0}    />
          <StatCard value="700M+"   label="People worldwide have dyslexia"                       icon="📖" delay={0.1}  />
          <StatCard value="4×"      label="Higher dropout risk for unserved students"             icon="⚠️" delay={0.2}  />
          <StatCard value="0"       label="Extra educator hours needed with NeuroLearn"           icon="✅" delay={0.3}  />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{
        padding: '100px 24px', position: 'relative',
        background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.04) 50%, transparent)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
              One upload. Four formats.<br />Every learner included.
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
              Built for real classrooms. No specialist training required.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {FEATURES.map((f, i) => (
              <GlassCard key={f.title} delay={i * 0.08}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${f.color}14`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 16,
                  border: `1px solid ${f.color}20`,
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 8, color: '#1e1b4b' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {f.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 24px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
            How it works
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { step: '01', title: 'Teacher uploads content',     desc: 'Paste a paragraph, upload a PDF, or type lesson notes directly into NeuroLearn.',                   icon: '📤', color: '#6366f1' },
            { step: '02', title: 'AI transforms in seconds',    desc: 'Our engine sends the content to Gemini AI with 4 cognitive profile prompts simultaneously.',          icon: '🤖', color: '#8b5cf6' },
            { step: '03', title: 'Students get their version',  desc: 'Each student sees content in their assigned mode — ADHD, Dyslexia, Autism, or Narrative.',           icon: '🎯', color: '#06b6d4' },
            { step: '04', title: 'Educator tracks progress',    desc: 'The dashboard shows engagement, completion, and lets educators override any student\'s profile.',    icon: '📊', color: '#10b981' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex', alignItems: 'center', gap: 24,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(16px)',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.07)',
                padding: '24px 28px',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: `${item.color}12`,
                border: `1px solid ${item.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: item.color, letterSpacing: '0.1em' }}>{item.step}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', margin: 0, letterSpacing: '-0.2px' }}>{item.title}</h3>
                </div>
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL IMPACT ── */}
      <section style={{
        padding: '100px 24px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 999, padding: '6px 16px', marginBottom: 28,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Our Mission
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800,
              letterSpacing: '-2px', color: '#fff', lineHeight: 1.1, marginBottom: 24,
            }}>
              Education shouldn't be<br />
              <span style={{
                background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>one-size-fits-all.</span>
            </h2>

            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,0.65)',
              maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.8,
            }}>
              Neurodivergent students aren't broken — the system is. NeuroLearn rebuilds the content itself, not just how it looks, so every student can access the same curriculum with dignity.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'No stigma',           icon: '🤝' },
                { label: 'No separate track',   icon: '🎯' },
                { label: 'No extra work for teachers', icon: '✅' },
                { label: 'Scales to districts', icon: '🏫' },
              ].map(item => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12, padding: '10px 18px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <span>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}
        >
          <h2 style={{
            fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900,
            letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 20,
          }}>
            Build the future of<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>inclusive education.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#6b7280', marginBottom: 48, lineHeight: 1.7 }}>
            Join educators transforming how neurodivergent students learn — one upload at a time.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagButton onClick={onTeacher} style={{ padding: '18px 40px', fontSize: 16 }}>
              👩‍🏫 Start as Teacher
            </MagButton>
            <MagButton onClick={onStudent} primary style={{ padding: '18px 40px', fontSize: 16 }}>
              👨‍🎓 Start as Student →
            </MagButton>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(99,102,241,0.1)',
        padding: '32px 24px', textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>🧠</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px', color: '#1e1b4b' }}>NeuroLearn</span>
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          Built for the hackathon · Adaptive Learning Infrastructure for Neurodivergent Students
        </p>
      </footer>
    </div>
  );
}
