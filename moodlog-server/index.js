const result = require('dotenv').config({ debug: true });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { analyzeDiary } = require('./gemini');

if (result.error) {
  console.error("❌ 도트엔브 에러 발생:", result.error);
}

console.log("--- 환경 변수 로드 결과 ---");
console.log(result.parsed);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. 기본 경로
app.get('/', (req, res) => {
  res.send('MoodLog 서버가 작동중입니다! 🚀');
});

// 2. DB 테스트 경로
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'DB 연결 성공!', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB 연결 실패' });
  }
});

app.get('/api/statistics', async (req, res) => {
  try {
    // 최근 7일간의 감정 점수 데이터를 가져옵니다.
    const queryText = `
      SELECT created_at, joy_score, sadness_score, anger_score, anxiety_score, neutral_score 
      FROM diaries 
      ORDER BY created_at ASC 
      LIMIT 7;
    `;
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "데이터를 불러오지 못했습니다." });
  }
});

// 3. 사용 가능한 모델 목록 확인용 경로 (디버그용)
app.get('/list-models', async (req, res) => {
  try {
    const axios = require('axios');
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

    const response = await axios.get(url);
    // 너무 많을 수 있으니 상위 몇 개만 보여줌
    const models = (response.data.models || []).slice(0, 20);
    res.json({ count: models.length, models });
  } catch (err) {
    console.error('📃 ListModels 에러:', err.response ? err.response.data : err.message);
    res.status(500).json({
      error: 'ListModels 호출 실패',
      detail: err.response ? err.response.data : err.message,
    });
  }
});

// 4. AI 테스트 경로 (이게 listen 위에 있어야 합니다!)
app.get('/test-ai', async (req, res) => {
  try {
    console.log("🤖 AI 분석 테스트 시작...");
    const result = await analyzeDiary("오늘 개발 공부를 했는데 너무 재밌었어!");
    res.json(result);
  } catch (err) {
    console.error("테스트 에러:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5. 실제 일기 저장 API
app.post('/api/diaries', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "일기 내용을 입력해주세요." });

  try {
    console.log("🤖 AI 분석 시작...");
    const analysis = await analyzeDiary(content);
    
    const queryText = `
      INSERT INTO diaries (content, emotion_label, joy_score, sadness_score, anger_score, anxiety_score, neutral_score, ai_reply)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      content, analysis.emotion_label, analysis.scores.joy,
      analysis.scores.sadness, analysis.scores.anger,
      analysis.scores.anxiety, analysis.scores.neutral, analysis.ai_reply
    ];

    const dbResult = await db.query(queryText, values);
    
    // DB 저장 결과에 AI 분석 결과(노래 추천 포함)를 추가해서 응답
    const responseData = {
      ...dbResult.rows[0],
      recommended_song: analysis.recommended_song || null
    };
    
    res.json(responseData);
  } catch (error) {
    console.error("❌ 에러 발생:", error);
    res.status(500).json({ error: "처리 오류" });
  }
});

// 6. 플레이리스트에 노래 추가
app.post('/api/playlists', async (req, res) => {
  const { song_title, artist, keyword, reason, diary_id } = req.body;
  
  if (!song_title || !artist || !keyword) {
    return res.status(400).json({ error: "노래 제목, 아티스트, 키워드는 필수입니다." });
  }

  try {
    // 중복 체크 (같은 노래가 같은 키워드로 이미 저장되어 있는지)
    const checkQuery = `
      SELECT id FROM playlists 
      WHERE song_title = $1 AND artist = $2 AND keyword = $3
    `;
    const existing = await db.query(checkQuery, [song_title, artist, keyword]);
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "이미 이 키워드로 저장된 노래입니다." });
    }

    const insertQuery = `
      INSERT INTO playlists (song_title, artist, keyword, reason, diary_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await db.query(insertQuery, [song_title, artist, keyword, reason || null, diary_id || null]);
    
    res.json({ message: "플레이리스트에 추가되었습니다!", song: result.rows[0] });
  } catch (error) {
    console.error("❌ 플레이리스트 추가 에러:", error);
    res.status(500).json({ error: "플레이리스트 추가 실패" });
  }
});

// 7. 모든 플레이리스트 조회 (키워드별 그룹화)
app.get('/api/playlists', async (req, res) => {
  try {
    const query = `
      SELECT 
        keyword,
        COUNT(*) as count,
        ARRAY_AGG(
          json_build_object(
            'id', id,
            'song_title', song_title,
            'artist', artist,
            'reason', reason,
            'created_at', created_at
          ) ORDER BY created_at DESC
        ) as songs
      FROM playlists
      GROUP BY keyword
      ORDER BY keyword;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ 플레이리스트 조회 에러:", error);
    res.status(500).json({ error: "플레이리스트 조회 실패" });
  }
});

// 8. 특정 키워드의 플레이리스트 조회
app.get('/api/playlists/:keyword', async (req, res) => {
  const { keyword } = req.params;
  
  try {
    const query = `
      SELECT * FROM playlists 
      WHERE keyword = $1 
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [keyword]);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ 플레이리스트 조회 에러:", error);
    res.status(500).json({ error: "플레이리스트 조회 실패" });
  }
});

// 9. 플레이리스트에서 노래 제거
app.delete('/api/playlists/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = `DELETE FROM playlists WHERE id = $1 RETURNING *;`;
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "해당 노래를 찾을 수 없습니다." });
    }
    
    res.json({ message: "플레이리스트에서 제거되었습니다.", song: result.rows[0] });
  } catch (error) {
    console.error("❌ 플레이리스트 제거 에러:", error);
    res.status(500).json({ error: "플레이리스트 제거 실패" });
  }
});

// 10. 서버 실행 (반드시 맨 아래에!)
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 달리고 있습니다!`);
  console.log("DB 계정:", process.env.DB_USER);
  console.log("API 키 로드 여부:", process.env.GEMINI_API_KEY ? "YES" : "NO");
});