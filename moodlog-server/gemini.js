  const axios = require('axios');
require('dotenv').config();

async function analyzeDiary(content) {
  const apiKey = process.env.GEMINI_API_KEY;
  // 라이브러리 대신 직접 구글 API 주소를 타격합니다.
  // 최신 REST 엔드포인트는 v1 + 콘솔에서 표시되는 모델 이름 조합을 사용합니다.
  // /list-models 결과에 나온 이름 중 하나를 그대로 사용해야 합니다.
  // 예: models/gemini-2.5-flash  → 여기서는 'gemini-2.5-flash' 만 넣습니다.
  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
    다음은 사용자가 쓴 일기 내용이야.
    이 내용을 분석해서 반드시 아래의 JSON 형식으로만, 다른 텍스트 없이 답변해줘.

    내용: "${content}"

    응답 형식 (JSON):
    {
      "emotion_label": "행복, 슬픔, 분노, 불안, 평온 중 선택",
      "scores": { "joy": 0~1, "sadness": 0~1, "anger": 0~1, "anxiety": 0~1, "neutral": 0~1 },
      "ai_reply": "사용자 감정에 공감하고 위로/격려/조언을 담은 한두 문장",
      "recommended_song": {
        "title": "노래 제목",
        "artist": "가수 이름",
        "reason": "이 노래를 추천하는 이유 (1문장)"
      }
    }

    위 JSON 형식을 반드시 지키고, 마크다운이나 설명 문장은 절대 추가하지 마.
  `;

  const data = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    });

    const text = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    // 에러가 나면 구글이 보내는 진짜 이유를 터미널에 찍습니다.
    const apiError = error.response ? error.response.data : error.message;
    console.error("❌ 구글 서버 진짜 에러 원인:", apiError);

    // 프론트/클라이언트에서도 실제 원인을 볼 수 있게 에러 메시지에 포함
    throw new Error("구글 API 호출 실패: " + JSON.stringify(apiError));
  }
}

async function recommendMusicByGenre(genre) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
    사용자가 "${genre}" 장르의 음악을 듣고 싶어해.
    이 장르에 어울리는 한국 또는 해외의 좋은 노래 10곡을 추천해줘.
    
    반드시 아래의 JSON 형식으로만, 다른 텍스트 없이 답변해줘.
    
    응답 형식 (JSON):
    [
      {
        "title": "노래 제목",
        "artist": "가수 이름",
        "reason": "추천 이유 (1문장)"
      },
      ... (총 10개)
    ]
    
    위 JSON 형식을 반드시 지키고, 마크다운이나 설명 문장은 절대 추가하지 마.
  `;

  const data = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    });

    const text = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/); // Array checking
    if (!jsonMatch) {
      throw new Error("JSON 형식을 찾을 수 없습니다.");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    const apiError = error.response ? error.response.data : error.message;
    console.error("❌ 음악 추천 에러:", apiError);
    throw new Error("음악 추천 실패: " + JSON.stringify(apiError));
  }
}

module.exports = { analyzeDiary, recommendMusicByGenre };