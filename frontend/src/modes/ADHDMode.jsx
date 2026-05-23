import { useState } from 'react';

function ADHDMode({ content }) {
  const chunks = content.split('\n').filter(line => line.trim() !== '');
  const [completed, setCompleted] = useState([]);
  const [xp, setXp] = useState(0);

  const markDone = (i) => {
    if (completed.includes(i)) return;
    setCompleted([...completed, i]);
    setXp(xp + 10);
  };

  const progress = Math.round((completed.length / chunks.length) * 100);

  return (
    <div style={{
      background: '#FFF9F0', minHeight: '100vh',
      padding: 24, fontFamily: 'Arial, sans-serif'
    }}>
      {/* XP Bar */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '12px 20px',
        marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', gap: 16
      }}>
        <span style={{ fontSize: 24 }}>⚡</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 600, color: '#1a1a2e' }}>Your Progress</span>
            <span style={{ fontWeight: 700, color: '#f59e0b' }}>{xp} XP</span>
          </div>
          <div style={{ background: '#e5e7eb', borderRadius: 999, height: 10 }}>
            <div style={{
              width: progress + '%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
              height: 10, borderRadius: 999, transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
        <span style={{ fontWeight: 700, color: '#6b7280' }}>{progress}%</span>
      </div>

      {/* Chunks */}
      {chunks.map((chunk, i) => (
        <div key={i} style={{
          background: completed.includes(i) ? '#f0fdf4' : '#fff',
          border: completed.includes(i) ? '2px solid #22c55e' : '2px solid #e5e7eb',
          borderRadius: 12, padding: 18, marginBottom: 14,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease'
        }}>
          <p style={{
            fontSize: 16, lineHeight: 1.8, margin: '0 0 12px',
            color: '#1a1a2e', fontWeight: 500
          }}>
            {chunk}
          </p>
          <button
            onClick={() => markDone(i)}
            disabled={completed.includes(i)}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: completed.includes(i) ? '#22c55e' : '#f59e0b',
              color: '#fff', fontWeight: 700, cursor: completed.includes(i) ? 'default' : 'pointer',
              fontSize: 14, transition: 'background 0.2s'
            }}
          >
            {completed.includes(i) ? '✓ Got it! +10 XP' : 'Mark as understood ⚡'}
          </button>
        </div>
      ))}

      {completed.length === chunks.length && chunks.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          borderRadius: 12, padding: 24, textAlign: 'center', color: '#fff'
        }}>
          <div style={{ fontSize: 48 }}>🏆</div>
          <h2 style={{ margin: '8px 0 4px' }}>Section Complete!</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>You earned {xp} XP — Amazing work!</p>
        </div>
      )}
    </div>
  );
}

export default ADHDMode;