import { useState } from 'react';

const DEMO_STUDENTS = [
  { id:1, name:'Arjun Sharma',  mode:'adhd',      progress:85, lastActive:'2 mins ago',  status:'active' },
  { id:2, name:'Priya Nair',    mode:'dyslexia',  progress:62, lastActive:'5 mins ago',  status:'active' },
  { id:3, name:'Rahul Verma',   mode:'autism',    progress:91, lastActive:'1 min ago',   status:'active' },
  { id:4, name:'Sneha Iyer',    mode:'narrative', progress:44, lastActive:'12 mins ago', status:'idle'   },
  { id:5, name:'Karan Mehta',   mode:'adhd',      progress:73, lastActive:'3 mins ago',  status:'active' },
  { id:6, name:'Ananya Pillai', mode:'dyslexia',  progress:38, lastActive:'20 mins ago', status:'idle'   },
];

const MODE_META = {
  adhd:      { bg:'#fef3c7', text:'#92400e', label:'⚡ ADHD'      },
  dyslexia:  { bg:'#dbeafe', text:'#1e40af', label:'📖 Dyslexia'  },
  autism:    { bg:'#d1fae5', text:'#065f46', label:'📋 Autism'    },
  narrative: { bg:'#ede9fe', text:'#5b21b6', label:'✨ Narrative'  },
};

const ALL_MODES = ['adhd','dyslexia','autism','narrative'];

function Dashboard({ onBack }) {
  const [students, setStudents]     = useState(DEMO_STUDENTS);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [uploadDone, setUploadDone] = useState(false);

  const changeMode = (id, mode) =>
    setStudents(prev => prev.map(s => s.id === id ? { ...s, mode } : s));

  const avgProgress = Math.round(
    students.reduce((sum, s) => sum + s.progress, 0) / students.length
  );

  return (
    <div style={{ background:'#f9fafb', minHeight:'100vh', fontFamily:'Arial, sans-serif' }}>

      {/* Header */}
      <div style={{
        background:'#1a1a2e', padding:'14px 28px',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ color:'#fff', fontWeight:700, fontSize:20 }}>🧠 NeuroLearn</span>
          <span style={{
            fontSize:12, padding:'3px 10px', borderRadius:999,
            background:'rgba(255,255,255,0.1)', color:'#fff'
          }}>Educator Dashboard</span>
        </div>
        <button onClick={onBack} style={{
          padding:'8px 16px', borderRadius:8,
          background:'rgba(255,255,255,0.1)',
          color:'#fff', border:'1px solid rgba(255,255,255,0.2)',
          cursor:'pointer', fontWeight:600
        }}>← Back to App</button>
      </div>

      <div style={{ padding:28 }}>

        {/* Stat cards */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))',
          gap:16, marginBottom:28
        }}>
          {[
            { label:'Total Students', value:students.length,                                    icon:'👥', color:'#1A56A0' },
            { label:'Active Now',     value:students.filter(s=>s.status==='active').length,     icon:'🟢', color:'#0F6E56' },
            { label:'Avg Progress',   value:avgProgress+'%',                                    icon:'📈', color:'#7C3AED' },
            { label:'Modes in Use',   value:new Set(students.map(s=>s.mode)).size,              icon:'🎯', color:'#f59e0b' },
          ].map(stat => (
            <div key={stat.label} style={{
              background:'#fff', borderRadius:12, padding:'18px 20px',
              boxShadow:'0 1px 6px rgba(0,0,0,0.06)',
              borderTop:`3px solid ${stat.color}`
            }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{stat.icon}</div>
              <div style={{ fontSize:26, fontWeight:700, color:'#1a1a2e' }}>{stat.value}</div>
              <div style={{ fontSize:13, color:'#6b7280', marginTop:2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mode distribution */}
        <div style={{
          background:'#fff', borderRadius:12, padding:20,
          boxShadow:'0 1px 6px rgba(0,0,0,0.06)', marginBottom:24
        }}>
          <h3 style={{ margin:'0 0 16px', color:'#1a1a2e', fontSize:16 }}>Mode Distribution</h3>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {ALL_MODES.map(m => {
              const count = students.filter(s => s.mode === m).length;
              const meta  = MODE_META[m];
              return (
                <div key={m} style={{ flex:1, minWidth:120 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{
                      fontSize:12, fontWeight:600, padding:'2px 8px',
                      borderRadius:999, background:meta.bg, color:meta.text
                    }}>{meta.label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{count}</span>
                  </div>
                  <div style={{ background:'#f3f4f6', borderRadius:999, height:8 }}>
                    <div style={{
                      width:`${(count/students.length)*100}%`,
                      background:meta.text, height:8, borderRadius:999,
                      transition:'width 0.4s'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload material */}
        <div style={{
          background:'#fff', borderRadius:12, padding:20,
          boxShadow:'0 1px 6px rgba(0,0,0,0.06)', marginBottom:24
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ margin:0, color:'#1a1a2e', fontSize:16 }}>📤 Upload New Material</h3>
            <button onClick={() => setShowUpload(!showUpload)} style={{
              padding:'7px 14px', borderRadius:8,
              border:'1.5px solid #1A56A0', color:'#1A56A0',
              background:'#fff', cursor:'pointer', fontWeight:600, fontSize:13
            }}>{showUpload ? 'Cancel' : '+ Upload'}</button>
          </div>

          {showUpload && (
            <div style={{ marginTop:16 }}>
              <textarea rows={4} value={uploadText}
                onChange={e => setUploadText(e.target.value)}
                placeholder="Paste lesson content to distribute to all students..."
                style={{
                  width:'100%', fontSize:14, padding:12,
                  borderRadius:8, border:'1.5px solid #e5e7eb',
                  boxSizing:'border-box', fontFamily:'Arial'
                }}
              />
              <button onClick={() => { setUploadDone(true); setShowUpload(false); }} style={{
                marginTop:10, padding:'10px 24px', borderRadius:8,
                background:'#1a1a2e', color:'#fff', border:'none',
                cursor:'pointer', fontWeight:700, fontSize:14
              }}>Distribute to All Students ✓</button>
            </div>
          )}
          {uploadDone && (
            <p style={{ margin:'12px 0 0', color:'#0F6E56', fontWeight:600, fontSize:14 }}>
              ✅ Material distributed to all students!
            </p>
          )}
        </div>

        {/* Student table */}
        <div style={{
          background:'#fff', borderRadius:12,
          boxShadow:'0 1px 6px rgba(0,0,0,0.06)', overflow:'hidden'
        }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #f3f4f6' }}>
            <h3 style={{ margin:0, color:'#1a1a2e', fontSize:16 }}>👥 Student Overview</h3>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#f9fafb' }}>
                  {['Student','Current Mode','Progress','Last Active','Status','Change Mode'].map(h => (
                    <th key={h} style={{
                      padding:'12px 16px', textAlign:'left',
                      fontSize:12, fontWeight:700, color:'#6b7280',
                      textTransform:'uppercase', letterSpacing:'0.05em'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const meta = MODE_META[s.mode];
                  return (
                    <tr key={s.id} style={{
                      borderTop:'1px solid #f3f4f6',
                      background: i % 2 === 0 ? '#fff' : '#fafafa'
                    }}>
                      <td style={{ padding:'14px 16px', fontWeight:600, color:'#1a1a2e' }}>
                        {s.name}
                      </td>
                      <td style={{ padding:'14px 16px' }}>
                        <span style={{
                          fontSize:12, padding:'4px 10px', borderRadius:999,
                          background:meta.bg, color:meta.text, fontWeight:600
                        }}>{meta.label}</span>
                      </td>
                      <td style={{ padding:'14px 16px', minWidth:140 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ flex:1, background:'#f3f4f6', borderRadius:999, height:6 }}>
                            <div style={{
                              width:s.progress+'%', height:6, borderRadius:999,
                              background: s.progress > 70 ? '#22c55e' : s.progress > 40 ? '#f59e0b' : '#ef4444',
                              transition:'width 0.4s'
                            }} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:'#374151', minWidth:32 }}>
                            {s.progress}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding:'14px 16px', fontSize:13, color:'#6b7280' }}>
                        {s.lastActive}
                      </td>
                      <td style={{ padding:'14px 16px' }}>
                        <span style={{
                          fontSize:12, padding:'3px 10px', borderRadius:999, fontWeight:600,
                          background: s.status === 'active' ? '#d1fae5' : '#f3f4f6',
                          color:       s.status === 'active' ? '#065f46' : '#6b7280'
                        }}>
                          {s.status === 'active' ? '🟢 Active' : '⚪ Idle'}
                        </span>
                      </td>
                      <td style={{ padding:'14px 16px' }}>
                        <select
                          value={s.mode}
                          onChange={e => changeMode(s.id, e.target.value)}
                          style={{
                            padding:'6px 10px', borderRadius:8, fontSize:13,
                            border:'1.5px solid #e5e7eb', background:'#fff',
                            cursor:'pointer', color:'#1a1a2e', fontWeight:600
                          }}
                        >
                          {ALL_MODES.map(m => (
                            <option key={m} value={m}>{MODE_META[m].label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;