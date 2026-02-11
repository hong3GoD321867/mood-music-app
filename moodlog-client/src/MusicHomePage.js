import React, { useState, useEffect } from 'react';

const MusicHomePage = ({ selectedGenres, onAddMusic, onEditGenres }) => {
  const [activeGenre, setActiveGenre] = useState(selectedGenres[0] || "");

  useEffect(() => {
    if (selectedGenres.length > 0) {
      setActiveGenre(selectedGenres[0]);
    }
  }, [selectedGenres]);

  const musicData = {
    "K-POP": [
      { id: 1, title: "Ditto", artist: "NewJeans", cover: "https://upload.wikimedia.org/wikipedia/ko/4/47/New_Jeans_Ditto.jpg" },
      { id: 2, title: "Hype Boy", artist: "NewJeans", cover: "https://upload.wikimedia.org/wikipedia/ko/d/d1/New_Jeans_1st_EP.jpg" },
      { id: 3, title: "Love Lee", artist: "AKMU", cover: "https://image.bugsm.co.kr/album/images/500/40904/4090453.jpg" },
    ],
    "재즈": [
      { id: 4, title: "Fly Me To The Moon", artist: "Frank Sinatra", cover: "https://upload.wikimedia.org/wikipedia/en/2/2e/Sinatra_-_Nothing_But_The_Best.jpg" },
      { id: 5, title: "L-O-V-E", artist: "Nat King Cole", cover: "https://upload.wikimedia.org/wikipedia/en/5/53/NatKingColeTheVeryBestOfAlbumCover.jpg" },
    ],
    "힙합": [
      { id: 6, title: "가시", artist: "Be'O", cover: "https://image.bugsm.co.kr/album/images/500/40671/4067144.jpg" },
    ]
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
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '25px',
      alignContent: 'start'
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
      transition: '0.2s'
    }),
    card: { backgroundColor: '#0f172a', padding: '15px', borderRadius: '20px', textAlign: 'center' },
    titleText: { fontWeight: '800', fontSize: '16px', color: '#fff', display: 'block', marginBottom: '4px' }
  };

  return (
    <div style={s.wrapper}>
      {/* ✅ 드디어 등장: 굵은 보라색 제목 */}
      <h1 style={s.mainTitle}>🎧 오늘의 추천 음악</h1>

      <div style={s.contentLayout}>
        {/* 왼쪽 사이드바 */}
        <div style={s.sidebar}>
          <h3 style={s.sidebarTitle}>GENRES</h3>
          {selectedGenres.map(genre => (
            <button key={genre} onClick={() => setActiveGenre(genre)} style={s.genreBtn(activeGenre === genre)}>
              {genre}
            </button>
          ))}
          <button onClick={onEditGenres} style={{ marginTop: '20px', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#334155', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>
            ⚙️ 취향 수정
          </button>
        </div>

        {/* 오른쪽 음악 그리드 */}
        <div style={s.mainGrid}>
          {(musicData[activeGenre] || []).map(music => (
            <div key={music.id} style={s.card} className="music-card">
              <img src={music.cover} alt={music.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '12px', aspectRatio: '1/1', objectFit: 'cover' }} />
              <span style={s.titleText}>{music.title}</span>
              <span style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '12px' }}>{music.artist}</span>
              <button 
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => onAddMusic(music, activeGenre)}
              >
                + 담기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicHomePage;