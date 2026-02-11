-- 플레이리스트 테이블 생성
-- 각 노래는 키워드(감정)별로 분류되어 저장됩니다

CREATE TABLE IF NOT EXISTS playlists (
  id SERIAL PRIMARY KEY,
  song_title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  keyword VARCHAR(50) NOT NULL, -- 감정 키워드 (예: 행복, 슬픔, 분노, 불안, 평온)
  reason TEXT, -- AI가 추천한 이유
  diary_id INTEGER REFERENCES diaries(id) ON DELETE SET NULL, -- 어떤 일기에서 추천되었는지 (선택사항)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 키워드별로 빠른 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_playlists_keyword ON playlists(keyword);
CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON playlists(created_at DESC);
