import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadPlaylists(); }, []);

  // 1. 카테고리(키워드) 목록 불러오기
  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/playlists');
      setPlaylists(response.data);
      if (response.data.length > 0 && !selectedKeyword) {
        loadSongsByKeyword(response.data[0].keyword);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // 2. 특정 키워드의 노래들 불러오기
  const loadSongsByKeyword = async (keyword) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/playlists/${encodeURIComponent(keyword)}`);
      setSongs(response.data);
      setSelectedKeyword(keyword);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // 3. ✅ 핵심: 내보내기 로직 (복구 완료)
  const handleExport = (platform) => {
    if (songs.length === 0) return alert("내보낼 곡이 없습니다!");
    
    // 현재 리스트에 있는 모든 곡을 "아티스트 제목" 문자열 배열로 만듦
    const songQueries = songs.map(s => `${s.artist} ${s.song_title}`);
    
    if (platform === 'melon') {
      const firstQuery = encodeURIComponent(songQueries[0]);
      // 멜론 검색창으로 연결
      window.open(`https://www.melon.com/search/total/index.htm?q=${firstQuery}`, '_blank');
      alert(`첫 번째 곡 '${songs[0].song_title}'을 멜론에서 검색합니다!`);
    } else if (platform === 'spotify') {
      const firstQuery = encodeURIComponent(songQueries[0]);
      // 스포티파이 검색창으로 연결
      window.open(`https://open.spotify.com/search/${firstQuery}`, '_blank');
    } else if (platform === 'copy') {
      const text = songQueries.join('\n');
      navigator.clipboard.writeText(text);
      alert("전체 곡 목록이 복사되었습니다! 메모장이나 플레이리스트 생성기에 붙여넣으세요.");
    }
  };

  // 4. ✅ 삭제 로직 (복구 완료)
  const removeSong = async (songId) => {
    if (!window.confirm('이 곡을 보관함에서 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/playlists/${songId}`);
      // 리스트 새로고침
      loadSongsByKeyword(selectedKeyword);
      loadPlaylists(); 
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const s = {
    wrapper: { display: 'flex', height: '85vh', gap: '20px', padding: '20px', color: '#fff' },
    sidebar: { 
      width: '220px', backgroundColor: '#1e293b', borderRadius: '24px', padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto'
    },
    mainContent: { 
      flex: 1, backgroundColor: '#1e293b', borderRadius: '24px', padding: '30px', overflowY: 'auto' 
    },
    keywordItem: (isActive) => ({
      padding: '14px 18px', borderRadius: '14px', cursor: 'pointer',
      backgroundColor: isActive ? '#8b5cf6' : 'transparent',
      transition: '0.3s', fontSize: '15px', fontWeight: isActive ? 'bold' : 'normal',
      color: isActive ? '#fff' : '#94a3b8', border: 'none', textAlign: 'left'
    }),
    songRow: {
      display: 'flex', alignItems: 'center', padding: '16px 0',
      borderBottom: '1px solid #334155', gap: '20px'
    },
    exportBtn: (bg) => ({
      padding: '10px 18px', borderRadius: '10px', border: 'none', 
      backgroundColor: bg, color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
    })
  };

  return (
    <div style={s.wrapper}>
      {/* 왼쪽: 키워드 메뉴 */}
      <div style={s.sidebar}>
        <h3 style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px', paddingLeft: '10px', letterSpacing: '1px' }}>LIBRARY</h3>
        {playlists.map(p => (
          <button 
            key={p.keyword} 
            onClick={() => loadSongsByKeyword(p.keyword)} 
            style={s.keywordItem(selectedKeyword === p.keyword)}
          >
            # {p.keyword} <span style={{ fontSize: '12px', opacity: 0.5, marginLeft: '5px' }}>{p.count}</span>
          </button>
        ))}
      </div>

      {/* 오른쪽: 노래 목록 */}
      <div style={s.mainContent}>
        {selectedKeyword ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>{selectedKeyword}</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>총 {songs.length}개의 트랙</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleExport('copy')} style={s.exportBtn('#475569')}>📋 목록 복사</button>
                <button onClick={() => handleExport('melon')} style={s.exportBtn('#00CD3C')}>Melon 검색</button>
                <button onClick={() => handleExport('spotify')} style={s.exportBtn('#1DB954')}>Spotify 검색</button>
              </div>
            </div>

            {songs.length > 0 ? (
              songs.map((song, index) => (
                <div key={song.id} style={s.songRow}>
                  <span style={{ color: '#64748b', width: '30px', textAlign: 'center' }}>{index + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{song.song_title}</div>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>{song.artist}</div>
                  </div>
                  <button 
                    onClick={() => removeSong(song.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    삭제
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>이 보관함은 비어있습니다.</div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>왼쪽에서 카테고리를 선택해 주세요.</div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;