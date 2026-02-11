// moodlog-server/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL 연결 성공! (객체 방식)');
});

pool.on('error', (err) => {
  console.error('❌ DB 연결 에러:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};