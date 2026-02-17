import React, { useState } from 'react';
import axios from 'axios';
import EmotionChart from './EmotionChart';

// ✅ 1. 상위(App.js)에서 넘겨준 onAddMusic 함수를 여기서 받습니다.
const DiaryPage = ({ onAddMusic }) => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const openMusicPlatform = (platform, title, artist) => {
    const query = encodeURIComponent(`${artist} ${title}`);
    const urls = {
      youtube: `https://music.youtube.com/search?q=${query}`,
      melon: `https://www.melon.com/search/total/index.htm?q=${query}`,
      spotify: `https://open.spotify.com/search/${query}`
    };
    window.open(urls[platform], '_blank');
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return alert("입력창이 비어있어요!");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/diaries', { content });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    container: { minHeight: '100vh', backgroundColor: '#ffffff', padding: '40px 60px', fontFamily: 'sans-serif', color: '#1a1a1a' },
    wrapper: { maxWidth: showChart ? '1100px' : '1000px', margin: '0 auto', transition: 'all 0.3s ease' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #f0f0f0', paddingBottom: '30px', marginBottom: '50px' },
    titleLogo: { fontSize: '32px', fontWeight: '300', letterSpacing: '-1.5px', margin: 0 },
    tabBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '10px 24px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px' },
    mainLayout: { display: 'grid', gridTemplateColumns: showChart ? '1fr' : '1.5fr 1fr', gap: '60px' },
    textarea: {
      width: '100%', height: '450px', fontSize: '18px', border: 'none', outline: 'none', resize: 'none', padding: '0',
      color: '#333', backgroundColor: 'transparent',
      lineHeight: '30px', backgroundImage: 'linear-gradient(transparent, transparent 29px, #e5e7eb 29px)', backgroundSize: '100% 30px', backgroundAttachment: 'local',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    analyzeBtn: { width: '100%', backgroundColor: '#000', color: '#fff', padding: '16px', borderRadius: '4px', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' },
    label: { fontSize: '11px', fontWeight: '800', color: '#ccc', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', display: 'block' },
    lpDisk: { width: '140px', height: '140px', backgroundColor: '#111', borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spin 8s linear infinite', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' },
    musicBtn: { flex: 1, padding: '8px', fontSize: '11px', border: '1px solid #eee', backgroundColor: '#fff', cursor: 'pointer', borderRadius: '4px' },
    // ✅ 담기 버튼용 스타일 추가
    addBtn: { width: '100%', padding: '10px', marginTop: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#8b5cf6', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={s.container}>
      <div style={s.wrapper}>
        <header style={s.header}>
          <div>
            <h1 style={{ ...s.titleLogo, color: '#333' }}>
              {showChart ? "ANALYTICS" : "일기 쓰기"}
            </h1>
            <div style={{ color: '#666', fontSize: '14px', marginTop: '5px', fontFamily: 'system-ui, sans-serif', fontWeight: '500' }}>
              {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
          <button style={s.tabBtn} onClick={() => setShowChart(!showChart)}>
            {showChart ? "BACK TO WRITE" : "VIEW STATS"}
          </button>
        </header>

        <div style={s.mainLayout}>
          {showChart ? (
            <div style={{ width: '100%', height: '500px', backgroundColor: '#fafafa', borderRadius: '12px', padding: '20px' }}>
              <EmotionChart />
            </div>
          ) : (
            <>
              <section>
                <textarea style={s.textarea} value={content} onChange={(e) => setContent(e.target.value)} placeholder="오늘 하루의 감정을 자유롭게 기록하세요..." />
                <button style={s.analyzeBtn} onClick={handleAnalyze} disabled={loading}>{loading ? "ANALYZING..." : "저장 및 AI 감정 분석"}</button>
              </section>

              <aside style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                <div>
                  <span style={s.label}>AI Analysis</span>
                  <div style={{ fontSize: '16px', lineHeight: '1.7', color: '#444', minHeight: '100px' }}>
                    {result ? (
                      <div>
                        <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#f0f0f0', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>{result.emotion_label}</div>
                        <p>{result.ai_reply}</p>
                      </div>
                    ) : (<p style={{ color: '#ccc' }}>감정을 분석 중입니다...</p>)}
                  </div>
                </div>

                {result?.recommended_song && (
                  <div>
                    <span style={s.label}>Recommended Track</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                      <div style={s.lpDisk}>
                        <div style={{ width: '35px', height: '35px', backgroundColor: '#fff', borderRadius: '50%', border: '8px solid #111' }}></div>
                        <div style={{ position: 'absolute', inset: '10px', border: '1px solid #222', borderRadius: '50%' }}></div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '18px', fontWeight: '700' }}>{result.recommended_song.title}</div>
                        <div style={{ color: '#888', fontSize: '14px', marginBottom: '15px' }}>{result.recommended_song.artist}</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button style={s.musicBtn} onClick={() => openMusicPlatform('youtube', result.recommended_song.title, result.recommended_song.artist)}>Youtube</button>
                          <button style={s.musicBtn} onClick={() => openMusicPlatform('melon', result.recommended_song.title, result.recommended_song.artist)}>Melon</button>
                          <button style={s.musicBtn} onClick={() => openMusicPlatform('spotify', result.recommended_song.title, result.recommended_song.artist)}>Spotify</button>
                        </div>
                        {/* ✅ [추가] 플레이리스트 담기 버튼 */}
                        <button
                          style={s.addBtn}
                          onClick={() => onAddMusic(result.recommended_song, result.emotion_label)}
                        >
                          + 플레이리스트에 담기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        textarea::placeholder { color: #ccc; }
      `}</style>
    </div>
  );
};

export default DiaryPage;