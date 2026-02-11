import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EmotionChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/statistics');
        const formattedData = response.data.map(item => ({
          ...item,
          date: new Date(item.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
        }));
        setData(formattedData);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };
    fetchData();
  }, []);

  return (
    // ✅ 불필요한 내부 padding, shadow, background를 싹 제거하고 100% 채움
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>📈 감정 변화 추이</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
          />
          <YAxis 
            domain={[0, 1]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          />
          <Legend iconType="circle" />
          
          {/* 선 굵기를 조절하고 부드러운 곡선(monotone) 적용 */}
          <Line type="monotone" dataKey="joy_score" name="기쁨" stroke="#FFD700" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="sadness_score" name="슬픔" stroke="#1877F2" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="anger_score" name="분노" stroke="#FF4D4F" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="anxiety_score" name="불안" stroke="#9467bd" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionChart;