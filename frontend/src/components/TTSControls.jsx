import { useState, useEffect } from 'react';

const WANTED_LANGUAGES = [
  { label: 'English',  code: 'en-US' },
  { label: 'Hindi',    code: 'hi-IN' },
  { label: 'Kannada',  code: 'kn-IN' },
  { label: 'Telugu',   code: 'te-IN' },
  { label: 'Tamil',    code: 'ta-IN' },
  { label: 'Spanish',  code: 'es-ES' },
  { label: 'French',   code: 'fr-FR' },
];

function TTSControls({ text }) {
  const [speaking,       setSpeaking]       = useState(false);
  const [rate,           setRate]           = useState(0.9);
  const [availableVoices,setAvailableVoices]= useState([]);
  const [selectedVoice,  setSelectedVoice]  = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length === 0) return;

      // Match installed voices to our wanted list
      const matched = [];
      WANTED_LANGUAGES.forEach(lang => {
        // Find any voice whose lang starts with our code (e.g. en-US, en-GB both match 'en')
        const found = allVoices.filter(v =>
          v.lang.toLowerCase().startsWith(lang.code.toLowerCase().slice(0, 2))
        );
        found.forEach(v => {
          matched.push({
            label: `${lang.label} — ${v.name}`,
            voice: v
          });
        });
      });

      // Fallback: if nothing matched, show all available voices
      const finalList = matched.length > 0
        ? matched
        : allVoices.map(v => ({ label: `${v.name} (${v.lang})`, voice: v }));

      setAvailableVoices(finalList);
      setSelectedVoice(finalList[0]?.voice || null);
    };

    // Voices load async in Chrome
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // also try immediately for Firefox/Safari
  }, []);

  const speak = () => {
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    if (selectedVoice) u.voice = selectedVoice;
    setSpeaking(true);
    u.onend  = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  return (
    <div style={{
      display:'flex', alignItems:'center', flexWrap:'wrap', gap:12,
      padding:'12px 16px', background:'#f0f9ff',
      borderRadius:10, border:'1px solid #bae6fd', marginBottom:16
    }}>
      <button onClick={speak} style={{
        padding:'8px 18px', borderRadius:8, border:'none',
        background: speaking ? '#ef4444' : '#0ea5e9',
        color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14
      }}>
        {speaking ? '⏹ Stop' : '▶ Read Aloud'}
      </button>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <label style={{ fontSize:12, color:'#0369a1', fontWeight:600 }}>
          Speed: {rate}x
        </label>
        <input type="range" min={0.5} max={1.5} step={0.1} value={rate}
          onChange={e => setRate(+e.target.value)} style={{ width:80 }} />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        <select
          onChange={e => {
            const voice = availableVoices[e.target.value]?.voice;
            setSelectedVoice(voice || null);
          }}
          style={{
            padding:'6px 10px', borderRadius:8, fontSize:13,
            border:'1px solid #bae6fd', background:'#fff',
            color:'#0369a1', fontWeight:600, maxWidth:260
          }}
        >
          {availableVoices.length === 0
            ? <option>Loading voices...</option>
            : availableVoices.map((v, i) => (
                <option key={i} value={i}>{v.label}</option>
              ))
          }
        </select>
        {availableVoices.length > 0 && (
          <span style={{ fontSize:11, color:'#0369a1', paddingLeft:4 }}>
            {availableVoices.length} voice{availableVoices.length > 1 ? 's' : ''} available on this device
          </span>
        )}
      </div>
    </div>
  );
}

export default TTSControls;