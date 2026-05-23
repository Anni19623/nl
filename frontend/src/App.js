import { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import ModeSelector  from './components/ModeSelector';
import STTButton     from './components/STTButton';
import TTSControls   from './components/TTSControls';
import ADHDMode      from './modes/ADHDMode';
import DyslexiaMode  from './modes/DyslexiaMode';
import AutismMode    from './modes/AutismMode';
import NarrativeMode from './modes/NarrativeMode';
import Dashboard     from './pages/Dashboard';

const SAMPLE_TEXT = `Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of glucose. This process takes place in the chloroplasts, specifically using the green pigment chlorophyll. Plants absorb carbon dioxide from the air through tiny pores called stomata, while water is absorbed from the soil through their roots. When sunlight hits the chlorophyll, it triggers a chemical reaction that converts these raw materials into glucose, which the plant uses for energy and growth. Oxygen is released as a byproduct — which is the air we breathe every day.`;

function App() {
  const [inputText,  setInputText]  = useState('');
  const [results,    setResults]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [activeMode, setActiveMode] = useState('adhd');
  const [page,       setPage]       = useState('upload');

  const handleTransform = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text first!');
      return;
    }
    if (inputText.trim().split(' ').length < 10) {
      toast.error('Please enter at least a few sentences for better results.');
      return;
    }
    setLoading(true);
    const loadingToast = toast.loading('Transforming for all learners...');
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/transform`, { text: inputText });
      setResults(res.data);
      toast.dismiss(loadingToast);
      toast.success('Transformed into 4 learning modes!');
      setPage('read');
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Backend not responding. Is it running?');
    }
    setLoading(false);
  };

  const getActiveContent = () => results?.[activeMode] || '';

  const renderMode = () => {
    if (!results) return null;
    const props = { content: results[activeMode] };
    if (activeMode === 'adhd')      return <ADHDMode      {...props} />;
    if (activeMode === 'dyslexia')  return <DyslexiaMode  {...props} />;
    if (activeMode === 'autism')    return <AutismMode     {...props} />;
    if (activeMode === 'narrative') return <NarrativeMode  {...props} />;
  };

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  if (page === 'dashboard') return <Dashboard onBack={() => setPage('upload')} />;

  // ── READER ─────────────────────────────────────────────────────────────────
  if (page === 'read' && results) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Toaster position="top-right" />

        {/* Navbar */}
        <div style={{
          background: '#1a1a2e', padding: '0 24px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
              🧠 NeuroLearn
            </span>
            <span style={{
              fontSize: 11, padding: '3px 8px', borderRadius: 999,
              background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
              fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>Student View</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPage('dashboard')} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer'
            }}>📊 Dashboard</button>
            <button onClick={() => { setPage('upload'); setResults(null); }} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer'
            }}>← New Text</button>
          </div>
        </div>

        {/* Controls strip */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px', position: 'sticky', top: 56, zIndex: 99,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <ModeSelector activeMode={activeMode} onSelect={m => {
            setActiveMode(m);
            toast(`Switched to ${m.toUpperCase()} mode`, { icon: '🔄', duration: 1500 });
          }} />
          <TTSControls text={getActiveContent()} />
        </div>

        {/* Mode content */}
        <div className="fade-in">
          {renderMode()}
        </div>
      </div>
    );
  }

  // ── UPLOAD ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)' }}>
      <Toaster position="top-right" />

      {/* Navbar */}
      <div style={{
        background: '#1a1a2e', padding: '0 28px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
          🧠 NeuroLearn
        </span>
        <button onClick={() => setPage('dashboard')} style={{
          padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: 'rgba(255,255,255,0.1)', color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer'
        }}>📊 Educator Dashboard</button>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '52px 24px 36px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#EEF4FB', border: '1px solid #bae6fd',
          borderRadius: 999, padding: '6px 16px', marginBottom: 20
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1A56A0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AI-Powered Neuro-Inclusive Learning
          </span>
        </div>
        <h1 style={{
          fontSize: 42, fontWeight: 800, color: '#1a1a2e',
          letterSpacing: '-1px', margin: '0 0 16px', lineHeight: 1.15
        }}>
          Every student learns<br />
          <span style={{
            background: 'linear-gradient(135deg, #1A56A0, #7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>differently.</span>
        </h1>
        <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Paste any lesson text and instantly get 4 neuro-inclusive versions — for ADHD, Dyslexia, Autism, and Narrative learners.
        </p>

        {/* Mode pills */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {[
            { icon:'⚡', label:'ADHD',      bg:'#fef3c7', color:'#92400e' },
            { icon:'📖', label:'Dyslexia',  bg:'#dbeafe', color:'#1e40af' },
            { icon:'📋', label:'Autism',    bg:'#d1fae5', color:'#065f46' },
            { icon:'✨', label:'Narrative', bg:'#ede9fe', color:'#5b21b6' },
          ].map(m => (
            <span key={m.label} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 14, fontWeight: 700,
              background: m.bg, color: m.color
            }}>{m.icon} {m.label}</span>
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{
        maxWidth: 700, margin: '0 auto', padding: '0 24px 60px'
      }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: 36,
          boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>
              Paste your lesson text
            </label>
            <button
              onClick={() => setInputText(SAMPLE_TEXT)}
              style={{
                fontSize: 12, padding: '4px 12px', borderRadius: 6,
                border: '1px solid #e5e7eb', background: '#f9fafb',
                color: '#6b7280', cursor: 'pointer', fontWeight: 600
              }}
            >Try a sample ✨</button>
          </div>

          <textarea rows={8} value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste any paragraph from a textbook, syllabus, or lesson here..."
            style={{
              width: '100%', fontSize: 15, padding: 16,
              borderRadius: 12, border: '1.5px solid #e5e7eb',
              fontFamily: 'Arial', lineHeight: 1.7,
              resize: 'vertical', boxSizing: 'border-box',
              color: '#1a1a2e', background: '#fafafa',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#1A56A0'}
            onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
          />

          {/* Word count */}
          <div style={{ textAlign: 'right', fontSize: 12, color: '#9ca3af', marginTop: 6, marginBottom: 16 }}>
            {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
          </div>

          {/* STT */}
          <STTButton onResult={t => setInputText(prev => (prev + ' ' + t).trim())} />

          {/* Transform button */}
          <button onClick={handleTransform} disabled={loading || !inputText.trim()} style={{
            marginTop: 16, width: '100%', padding: '16px',
            fontSize: 16, fontWeight: 800, borderRadius: 12,
            border: 'none', cursor: loading ? 'wait' : 'pointer',
            background: loading
              ? '#9ca3af'
              : 'linear-gradient(135deg, #1a1a2e 0%, #1A56A0 100%)',
            color: '#fff', letterSpacing: '-0.3px',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(26,86,160,0.35)',
            transition: 'all 0.2s'
          }}>
            {loading
              ? <span className="pulse">⏳ Transforming for all learners...</span>
              : '✨ Transform for All Learners →'
            }
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 14 }}>
            Powered by Gemini AI · Results in ~10 seconds
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;