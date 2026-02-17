import React, { useState } from 'react';
import './App.css'; // CSS 파일 연결 확인!

const AuthPage = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      console.log("회원가입 시도:", email);
      onLoginSuccess('genre_selection');
    } else {
      console.log("로그인 시도:", email);
      onLoginSuccess('main');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">{isSignup ? "Sign up" : "login in"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="아이디(이메일)"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="비밀번호"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-submit-btn" type="submit">
            {isSignup ? "가입하기" : "로그인"}
          </button>
        </form>

        <button className="auth-toggle-btn" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "이미 계정이 있으신가요? 로그인" : "처음이신가요? 회원가입"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;