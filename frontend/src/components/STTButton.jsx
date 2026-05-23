import { useState } from 'react';

function STTButton({ onResult }) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Use Google Chrome for speech recognition.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend   = () => setListening(false);
    recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    recognition.onerror  = () => setListening(false);
    recognition.start();
  };

  return (
    <button onClick={startListening} disabled={listening} style={{
      padding: '14px 20px', borderRadius: 10, fontSize: 20,
      border: listening ? '2px solid #ef4444' : '2px solid #e5e7eb',
      background: listening ? '#fef2f2' : '#f9fafb',
      color: listening ? '#ef4444' : '#374151',
      cursor: listening ? 'wait' : 'pointer',
      display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700
    }}>
      {listening ? '🔴' : '🎙️'}
      <span style={{ fontSize: 13 }}>{listening ? 'Listening...' : 'Speak'}</span>
    </button>
  );
}

export default STTButton;