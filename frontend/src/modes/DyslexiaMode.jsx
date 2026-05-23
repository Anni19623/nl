import React, { useState } from 'react';

const BG_OPTIONS = [
  { label: 'Cream', value: '#FDFAF3' },
  { label: 'Sky Blue', value: '#EEF4FB' },
  { label: 'Mint', value: '#F2FAF5' },
  { label: 'White', value: '#FFFFFF' },
];

function DyslexiaMode({ content }) {
  const [fontSize, setFontSize] = useState(20);
  const [lineHeight, setLineHeight] = useState(2.2);
  const [bg, setBg] = useState('#FDFAF3');
  const [speaking, setSpeaking] = useState(false);
  const [activeWord, setActiveWord] = useState(null);

  const sentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim());

  const speakWord = (word) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.85;
    setActiveWord(word);
    u.onend = () => setActiveWord(null);
    window.speechSynthesis.speak(u);
  };

  const speakAll = () => {
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(content);
    u.rate = 0.85;
    setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: 24, transition: 'background 0.3s' }}>
      {/* Toolbar */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '12px 20px',
        marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center'
      }}>
        <div>
          <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Font size: {fontSize}px
          </label>
          <input type="range" min={16} max={28} value={fontSize}
            onChange={e => setFontSize(+e.target.value)} style={{ width: 90 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>
            Line spacing: {lineHeight}
          </label>
          <input type="range" min={1.6} max={3.0} step={0.1} value={lineHeight}
            onChange={e => setLineHeight(+e.target.value)} style={{ width: 90 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Background</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {BG_OPTIONS.map(opt => (
              <div key={opt.value} onClick={() => setBg(opt.value)} style={{
                width: 22, height: 22, borderRadius: '50%',
                background: opt.value, cursor: 'pointer',
                border: bg === opt.value ? '2px solid #1A56A0' : '2px solid #e5e7eb'
              }} title={opt.label} />
            ))}
          </div>
        </div>
        <button onClick={speakAll} style={{
          padding: '8px 16px', borderRadius: 8,
          background: speaking ? '#ef4444' : '#1A56A0',
          color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600
        }}>
          {speaking ? '⏹ Stop' : '▶ Read Aloud'}
        </button>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 720, margin: '0 auto',
        fontFamily: 'Lexend, Arial, sans-serif',
        fontSize: fontSize, lineHeight: lineHeight,
        letterSpacing: '0.05em'
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500&display=swap" rel="stylesheet" />
        {sentences.map((sentence, si) => (
          <p key={si} style={{ marginBottom: '1.2em' }}>
            {sentence.split(' ').map((word, wi) => (
              <span key={wi} onClick={() => speakWord(word)} style={{
                cursor: 'pointer', borderRadius: 3, padding: '1px 2px',
                background: activeWord === word ? '#9FE1CB' : 'transparent',
                transition: 'background 0.2s',
                color: wi % 2 === 0 ? '#1a1a2e' : '#1A56A0'
              }}>
                {word}{' '}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

export default DyslexiaMode;