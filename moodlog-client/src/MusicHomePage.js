import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MusicHomePage = ({ selectedGenres, onAddMusic, onEditGenres }) => {
  const [activeGenre, setActiveGenre] = useState(selectedGenres[0] || "");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGenres.length > 0 && !activeGenre) {
      setActiveGenre(selectedGenres[0]);
    }
  }, [selectedGenres, activeGenre]);

  // 장르가 변경되면 추천 음악을 새로 가져옵니다.
  useEffect(() => {
    if (activeGenre) {
      fetchRecommendations(activeGenre);
    }
  }, [activeGenre]);

  const fetchRecommendations = async (genre) => {
    setLoading(true);
    setRecommendations([]); // 기존 데이터 초기화
    try {
      const response = await axios.post('http://localhost:5000/api/music/recommend', { genre });
      setRecommendations(response.data);
    } catch (error) {
      console.error("음악 추천 불러오기 실패:", error);
      alert("음악 추천을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const s = {
    // 제목을 위에 두기 위해 column으로 설정
    wrapper: { display: 'flex', flexDirection: 'column', gap: '20px', color: '#fff', paddingTop: '20px' },

    // ✅ 오늘의 추천 음악 전용 스타일 (보라색 + 900 굵기)
    mainTitle: {
      fontSize: '36px',
      fontWeight: '900', // ㅈㄴ 굵게
      color: '#8b5cf6',   // 보라색
      textAlign: 'center',
      marginBottom: '20px',
      display: 'block'
    },

    contentLayout: { display: 'flex', gap: '25px' },

    sidebar: {
      width: '180px',
      backgroundColor: '#1e293b',
      borderRadius: '24px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: 'fit-content'
    },
    sidebarTitle: {
      fontSize: '12px',
      color: '#64748b',
      marginBottom: '15px',
      paddingLeft: '10px',
      fontWeight: '800',
      letterSpacing: '1px'
    },
    mainGrid: {
      flex: 1,
      backgroundColor: '#1e293b',
      borderRadius: '24px',
      padding: '30px',
      // 그리드 레이아웃 수정: 더 많은 아이템을 위해 minmax 조절
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
      alignContent: 'start',
      minHeight: '400px' // 로딩 중에도 영역 유지
    },
    genreBtn: (isActive) => ({
      padding: '15px',
      borderRadius: '15px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: isActive ? '800' : '500',
      backgroundColor: isActive ? '#8b5cf6' : 'transparent',
      color: isActive ? '#fff' : '#94a3b8',
      border: 'none',
      marginBottom: '8px',
      transition: '0.2s',
      textAlign: 'left',
      width: '100%'
    }),
    card: {
      backgroundColor: '#0f172a',
      padding: '20px',
      borderRadius: '20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    },
    titleText: { fontWeight: '800', fontSize: '16px', color: '#fff', display: 'block', marginBottom: '4px' },
    loadingContainer: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      color: '#94a3b8'
    }
  };

  return (
    <div style={s.wrapper}>
      {/* ✅ 드디어 등장: 굵은 보라색 제목 */}
      <h1 style={s.mainTitle}>🎧 {activeGenre ? `${activeGenre} 추천 음악` : '오늘의 추천 음악'}</h1>

      <div style={s.contentLayout}>
        {/* 왼쪽 사이드바 */}
        <div style={s.sidebar}>
          <h3 style={s.sidebarTitle}>GENRES</h3>
          {selectedGenres.map(genre => (
            <button key={genre} onClick={() => setActiveGenre(genre)} style={s.genreBtn(activeGenre === genre)}>
              {genre}
            </button>
          ))}
          <button onClick={onEditGenres} style={{ marginTop: '20px', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#334155', color: '#94a3b8', cursor: 'pointer', fontSize: '12px', width: '100%' }}>
            ⚙️ 취향 수정
          </button>
        </div>

        {/* 오른쪽 음악 그리드 */}
        <div style={s.mainGrid}>
          {loading ? (
            <div style={s.loadingContainer}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>🎵</div>
              <div>AI가 {activeGenre} 음악을 고르고 있어요...</div>
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((music, index) => (
              <div key={index} style={s.card} className="music-card">
                {/* 앨범 커버 대신 장르별 그라데이션 박스 사용 */}
                <div style={{
                  width: '100%',
                  borderRadius: '12px',
                  marginBottom: '15px',
                  aspectRatio: '1/1',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px'
                }}>
                  🎵
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <span style={s.titleText}>{music.title}</span>
                  <span style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>{music.artist}</span>
                  <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0, height: '45px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    "{music.reason}"
                  </p>
                </div>

                <button
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                  onClick={() => onAddMusic({ ...music, cover: null }, activeGenre)}
                >
                  + 담기
                </button>
              </div>
            ))
          ) : (
            <div style={s.loadingContainer}>
              추천 음악이 없습니다. 다른 장르를 선택해보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicHomePage;