import { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Landing       from './pages/Landing';
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
  // pages: 'landing' | 'upload' | 'read' | 'dashboard'
  const [page, setPage] = useState('landing');

  const handleTransform = async () => {
    if (!inputText.trim()) { toast.error('Please enter some text first!'); return; }
    setLoading(true);
    const t = toast.loading('Transforming for all learners...');
    try {
      const res = await axios.post('http://localhost:5000/api/transform', { text: inputText });
      setResults(res.data);
      toast.dismiss(t);
      toast.success('Transformed into 4 learning modes!');
      setPage('read');
    } catch {
      toast.dismiss(t);
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

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (page === 'landing') {
    return <Landing
      onTeacher={() => setPage('dashboard')}
      onStudent={() => setPage('upload')}
    />;
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  if (page === 'dashboard') return <Dashboard onBack={() => setPage('landing')} />;

  // ── READER ─────────────────────────────────────────────────────────────────
  if (page === 'read' && results) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Toaster position="top-right" />
        <div style={{
          background: '#1e1b4b', padding: '0 24px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14 }}>🧠</div>
            <span style={{ color:'#fff', fontWeight:800, fontSize:17, letterSpacing:'-0.5px' }}>NeuroLearn</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => setPage('dashboard')} style={{ padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,background:'rgba(255,255,255,0.1)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',cursor:'pointer' }}>📊 Dashboard</button>
            <button onClick={() => setPage('landing')} style={{ padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,background:'rgba(255,255,255,0.1)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',cursor:'pointer' }}>← Home</button>
          </div>
        </div>
        <div style={{ background:'#f9fafb', padding:'16px 24px 0', position:'sticky', top:56, zIndex:99, borderBottom:'1px solid #e5e7eb' }}>
          <ModeSelector activeMode={activeMode} onSelect={m => { setActiveMode(m); toast(`Switched to ${m.toUpperCase()} mode`, { icon:'🔄', duration:1500 }); }} />
          <TTSControls text={getActiveContent()} />
        </div>
        {renderMode()}
      </div>
    );
  }

  // ── UPLOAD ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f0f4ff,#faf5ff)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Toaster position="top-right" />
      <div style={{ background:'rgba(255,255,255,0.8)', backdropFilter:'blur(20px)', borderRadius:24, padding:40, width:'100%', maxWidth:680, boxShadow:'0 8px 40px rgba(99,102,241,0.12)', border:'1px solid rgba(255,255,255,0.9)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🧠</div>
            <h1 style={{ margin:0, color:'#1e1b4b', fontSize:22, fontWeight:800, letterSpacing:'-0.5px' }}>NeuroLearn</h1>
          </div>
          <button onClick={() => setPage('landing')} style={{ fontSize:12,padding:'5px 12px',borderRadius:8,border:'1px solid #e5e7eb',background:'#f9fafb',color:'#6b7280',cursor:'pointer',fontWeight:600 }}>← Home</button>
        </div>
        <p style={{ color:'#6b7280', margin:'0 0 24px', fontSize:14 }}>Paste lesson text and transform it into 4 neuro-inclusive formats.</p>

        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:6 }}>
          <button onClick={() => setInputText(SAMPLE_TEXT)} style={{ fontSize:12,padding:'4px 12px',borderRadius:6,border:'1px solid #e5e7eb',background:'#f9fafb',color:'#6b7280',cursor:'pointer',fontWeight:600 }}>Try a sample ✨</button>
        </div>
        <textarea rows={8} value={inputText} onChange={e => setInputText(e.target.value)}
          placeholder="Paste any lesson text here..."
          style={{ width:'100%',fontSize:15,padding:16,borderRadius:12,border:'1.5px solid #e5e7eb',fontFamily:'inherit',lineHeight:1.7,resize:'vertical',boxSizing:'border-box',color:'#1e1b4b',background:'#fafafa' }}
          onFocus={e => e.target.style.borderColor='#6366f1'}
          onBlur={e  => e.target.style.borderColor='#e5e7eb'}
        />
        <div style={{ textAlign:'right',fontSize:12,color:'#9ca3af',marginTop:4,marginBottom:12 }}>
          {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
        </div>
        <STTButton onResult={t => setInputText(prev => (prev+' '+t).trim())} />
        <button onClick={handleTransform} disabled={loading||!inputText.trim()} style={{ marginTop:14,width:'100%',padding:'15px',fontSize:16,fontWeight:800,borderRadius:12,border:'none',cursor:loading?'wait':'pointer',background:loading?'#9ca3af':'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',letterSpacing:'-0.2px',boxShadow:loading?'none':'0 4px 20px rgba(99,102,241,0.35)' }}>
          {loading ? '⏳ Transforming...' : '✨ Transform for All Learners →'}
        </button>
      </div>
    </div>
  );
}

export default App;