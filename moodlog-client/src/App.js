import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthPage from './AuthPage';
import GenreSelection from './GenreSelection';
import DiaryPage from './DiaryPage';
import PlaylistPage from './PlaylistPage';
import MusicHomePage from './MusicHomePage';

function App() {
  const [user, setUser] = useState(null);
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [currentPage, setCurrentPage] = useState('auth'); 
  const [userGenres, setUserGenres] = useState(["K-POP", "재즈", "힙합"]);

  const addToPlaylist = async (music, genre) => {
    try {
      await axios.post('http://localhost:5000/api/playlists', {
        song_title: music.title,
        artist: music.artist,
        keyword: genre,
        reason: "장르 추천을 통해 담은 곡"
      });
      alert(`${music.title}곡이 플레이리스트에 저장되었습니다!`);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("이미 저장되어 있거나 서버 에러가 발생했습니다.");
    }
  };

  const handleLogin = (nextStep) => {
    setUser({ email: 'test@test.com' });
    setCurrentPage(nextStep);
  };

  const handleGenreComplete = (selectedGenres) => {
    setUserGenres(selectedGenres);
    setCurrentPage('main');
  };

  if (currentPage === 'auth') return <AuthPage onLoginSuccess={handleLogin} />;
  if (currentPage === 'genre_selection') return <GenreSelection onComplete={handleGenreComplete} />;

  return (
    <div className="App">
      <nav style={{
        backgroundColor: 'rgba(15,23,42,0.8)',
        backdropFilter:'blur(10px)', // ✅ 오타 수정 (backgroundFilter -> backdropFilter)
        padding:'15px 20px',
        display:'flex',
        justifyContent:'center',
        gap:'15px',
        position:'sticky',
        top: 0,
        zIndex:1000,
        borderBottom:'1px solid rgba(255,255,255,0.1)'
      }}>
        <NavButton label="🏠 Home" active={currentPage === 'main'} onClick={() => setCurrentPage('main')} />
        <NavButton label="✍️ Diary" active={currentPage === 'diary'} onClick={() => setCurrentPage('diary')} />
        <NavButton label="🎵 Library" active={currentPage === 'playlist'} onClick={() => setCurrentPage('playlist')} />
      </nav>

      <div style={{ padding: '20px' }}>
        {currentPage === 'main' && (
          <>
            {/* ❌ 중복되던 얇은 제목(h1, p)을 여기서 완전히 지웠습니다! ❌ */}
            <MusicHomePage 
              selectedGenres={userGenres} 
              onAddMusic={addToPlaylist} 
              onEditGenres={() => setCurrentPage('genre_selection')}
            />
          </>
        )}

        {currentPage === 'diary' &&(<DiaryPage onAddMusic={addToPlaylist}/>
        )}
        {currentPage === 'playlist' && <PlaylistPage />}
        
        {currentPage === 'genre_selection' && (
          <GenreSelection onComplete={handleGenreComplete} />
        )}
      </div>
    </div>
  );
}

const NavButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: active ? '#8b5cf6' : 'transparent',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }}
  >
    {label}
  </button>
);

export default App;