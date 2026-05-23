function NarrativeMode({ content }) {
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      minHeight: '100vh', padding: 32, fontFamily: 'Georgia, serif'
    }}>
      <div style={{
        maxWidth: 680, margin: '0 auto',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 16, padding: 32,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
          <h2 style={{ color: '#f59e0b', margin: 0, fontFamily: 'Georgia, serif', fontSize: 24 }}>
            Alex's Learning Adventure
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '8px 0 0', fontSize: 13 }}>
            Chapter — Today's Lesson
          </p>
        </div>

        {paragraphs.map((para, i) => (
          <p key={i} style={{
            color: 'rgba(255,255,255,0.88)', fontSize: 17,
            lineHeight: 2, marginBottom: 20,
            textIndent: i === 0 ? 0 : '1.5em'
          }}>
            {para}
          </p>
        ))}

        <div style={{
          marginTop: 32, padding: '16px 20px',
          background: 'rgba(245,158,11,0.15)',
          borderRadius: 10, borderLeft: '3px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#fbbf24', fontSize: 14, fontStyle: 'italic' }}>
            "And that's how Alex learned something new today. What will you discover tomorrow?"
          </p>
        </div>
      </div>
    </div>
  );
}

export default NarrativeMode;