const MODES = [
  { key: 'adhd',      label: 'ADHD',      emoji: '⚡', color: '#f59e0b', desc: 'Gamified chunks' },
  { key: 'dyslexia',  label: 'Dyslexia',  emoji: '📖', color: '#1A56A0', desc: 'Reader friendly' },
  { key: 'autism',    label: 'Autism',    emoji: '📋', color: '#0F6E56', desc: 'Structured facts' },
  { key: 'narrative', label: 'Narrative', emoji: '✨', color: '#7C3AED', desc: 'Story mode' },
];

function ModeSelector({ activeMode, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
      {MODES.map(m => (
        <button key={m.key} onClick={() => onSelect(m.key)} style={{
          padding: '12px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: activeMode === m.key ? m.color : '#f3f4f6',
          color: activeMode === m.key ? '#fff' : '#374151',
          fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
          boxShadow: activeMode === m.key ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
        }}>
          {m.emoji} {m.label}
          <span style={{
            display: 'block', fontSize: 11,
            opacity: 0.8, fontWeight: 400, marginTop: 2
          }}>
            {m.desc}
          </span>
        </button>
      ))}
    </div>
  );
}

export default ModeSelector;