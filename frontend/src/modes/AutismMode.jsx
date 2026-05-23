function AutismMode({ content }) {
  const lines = content.split('\n').filter(l => l.trim() !== '');

  return (
    <div style={{
      background: '#FFFFFF', minHeight: '100vh',
      padding: 32, fontFamily: 'Arial, sans-serif',
      maxWidth: 720, margin: '0 auto'
    }}>
      <div style={{
        background: '#F8F9FA', borderRadius: 8,
        padding: '10px 16px', marginBottom: 28,
        borderLeft: '4px solid #1A56A0'
      }}>
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>
          📋 Reading Mode: Structured Facts
        </span>
      </div>

      {lines.map((line, i) => (
        <div key={i} style={{
          display: 'flex', gap: 16, alignItems: 'flex-start',
          padding: '14px 0',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 4,
            background: '#1A56A0', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 2
          }}>
            {i + 1}
          </div>
          <p style={{
            margin: 0, fontSize: 17, lineHeight: 1.8,
            color: '#1a1a2e', fontWeight: 400
          }}>
            {line.replace(/^\d+\.\s*/, '')}
          </p>
        </div>
      ))}

      <div style={{
        marginTop: 32, padding: 16,
        background: '#F0FDF4', borderRadius: 8,
        border: '1px solid #86EFAC'
      }}>
        <p style={{ margin: 0, fontSize: 14, color: '#166534', fontWeight: 600 }}>
          ✓ You have reached the end of this section.
        </p>
      </div>
    </div>
  );
}

export default AutismMode;