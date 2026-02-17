# 🎵 MoodLog (무드로그)

MoodLog는 사용자의 감정을 기록하고, AI 분석을 통해 맞춤형 음악을 추천해주는 웹 애플리케이션입니다.
일기를 작성하면 Google Gemini AI가 감정을 분석해 어울리는 음악을 추천해주며, 사용자는 이를 자신의 플레이리스트에 저장하여 관리할 수 있습니다.

## ✨ 주요 기능 (Key Features)

1.  **감정 일기 (Mood Diary)**
    *   사용자가 일기를 작성하면 AI가 내용을 분석하여 5가지 감정(행복, 슬픔, 분노, 불안, 평온) 점수를 도출합니다.
    *   분석된 감정을 바탕으로 AI가 따뜻한 위로의 한마디를 건넵니다.
    *   일기 작성 내역과 감정 분석 결과는 데이터베이스에 저장됩니다.

2.  **실시간 음악 추천 (Real-time Music Recommendation)**
    *   사용자가 선택한 장르(K-POP, 재즈, 힙합 등)에 맞춰 Gemini AI가 실시간으로 10곡의 음악을 추천합니다.
    *   각 추천 곡에는 AI가 작성한 추천 이유가 함께 제공됩니다.
    *   마음에 드는 곡은 즉시 내 플레이리스트에 추가할 수 있습니다.

3.  **마이 플레이리스트 (My Playlist)**
    *   일기 분석 또는 장르 추천을 통해 저장한 음악들을 한곳에서 모아볼 수 있습니다.
    *   장르/키워드별로 분류되어 있어 기분에 따라 듣고 싶은 노래를 쉽게 찾을 수 있습니다.

## 🛠 기술 스택 (Tech Stack)

### Frontend
-   **React**: 사용자 인터페이스(UI) 구축
-   **Axios**: 서버와의 API 통신
-   **React Router**: 페이지 라우팅
-   **Recharts**: 감정 통계 시각화 (차트 라이브러리)
-   **Lucide React**: 아이콘 사용

### Backend
-   **Node.js & Express**: 웹 서버 구축 및 API 엔드포인트 구현
-   **PostgreSQL**: 일기 및 플레이리스트 데이터 저장을 위한 관계형 데이터베이스
-   **Google Gemini API**: 자연어 처리(감정 분석) 및 음악 추천 생성
-   **Dotenv**: 환경 변수 관리

## 📂 폴더 구조 (Project Structure)

```
moodlog/
├── moodlog-client/       # 프론트엔드 (React)
│   ├── public/
│   ├── src/
│   │   ├── App.js        # 메인 앱 컴포넌트 & 라우팅
│   │   ├── AuthPage.js   # 로그인/회원가입 페이지
│   │   ├── DiaryPage.js  # 일기 작성 및 분석 페이지
│   │   ├── MusicHomePage.js # 음악 추천 페이지
│   │   ├── PlaylistPage.js # 플레이리스트 페이지
│   │   └── ...
│   └── package.json
│
├── moodlog-server/       # 백엔드 (Node.js/Express)
│   ├── index.js          # 서버 메인 파일 (API 정의)
│   ├── gemini.js         # Gemini AI 연동 모듈
│   ├── db.js             # PostgreSQL 연결 설정
│   └── package.json
│
└── README.md             # 프로젝트 설명 파일
```

## 🚀 시작하기 (Getting Started)

### 1. 환경 변수 설정 (.env)
`moodlog-server` 폴더 안에 `.env` 파일을 생성하고 아래 내용을 입력해야 합니다.

```env
# Server Port
PORT=5000

# PostgreSQL Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=moodlog
DB_PASSWORD=your_password
DB_PORT=5432

# Google Gemini API Key
GEMINI_API_KEY=your_api_key_here
```

### 2. 백엔드 실행
```bash
cd moodlog-server
npm install
node index.js
```

### 3. 프론트엔드 실행
```bash
cd moodlog-client
npm install
npm start
```

그럼 브라우저에서 `http://localhost:3000`으로 접속하여 MoodLog를 사용할 수 있습니다!

## 📸 스크린샷


