import React, { useState } from 'react';

const GenreSelection = ({ onComplete }) => {
  const genres = ["K-POP", "팝", "힙합", "R&B", "재즈", "클래식", "인디", "락", "댄스", "발라드"];
  const [selected, setSelected] = useState([]);

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter(g => g !== genre));
    } else {
      setSelected([...selected, genre]);
    }
  };

  const s = {
    wrapper: { minHeight: '100vh', padding: '60px 20px', backgroundColor: '#fff', textAlign: 'center' },
    container: { maxWidth: '600px', margin: '0 auto' },
    chip: (isActive) => ({
      display: 'inline-block', padding: '12px 25px', margin: '8px', borderRadius: '30px', border: '2px solid #4A90E2',
      backgroundColor: isActive ? '#4A90E2' : '#fff', color: isActive ? '#fff' : '#4A90E2',
      cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s'
    }),
    nextBtn: { marginTop: '40px', padding: '15px 60px', borderRadius: '30px', border: 'none', backgroundColor: '#333', color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.container}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>취향 선택 🎵</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>좋아하는 음악 장르를 알려주세요. (다중 선택 가능)</p>
        
        <div style={{ marginBottom: '20px' }}>
          {genres.map(genre => (
            <div 
              key={genre} 
              style={s.chip(selected.includes(genre))}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </div>
          ))}
        </div>

        <button 
          style={s.nextBtn} 
          onClick={() => onComplete(selected)}
          disabled={selected.length === 0}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};

export default GenreSelection;