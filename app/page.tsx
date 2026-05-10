'use client';

import { useState, useEffect } from 'react';

// ===== MOCK 데이터 =====
const MOCK_STOCKS = {
short: [
{
sector: 'AI반도체',
sectorColor: '#ff6b6b',
sectorVolume: '16.5조',
news: '엔비디아 1분기 실적 시장 전망 상회... AI 칩 수요 폭증 전망에 반도체 업황 기대감 ↑',
newsSource: '뉴시스 | 2시간 전',
stocks: [
{ name: '삼성전자', code: '005930', baseSector: '전기전자', flowTheme: 'AI반도체', price: 72300, change: 4.2, volume: '8,500억' },
{ name: 'SK하이닉스', code: '000660', baseSector: '전기전자', flowTheme: 'AI반도체', price: 186500, change: 3.8, volume: '6,200억' },
{ name: '한미반도체', code: '086520', baseSector: '반도체장비', flowTheme: 'AI반도체', price: 142000, change: 5.1, volume: '1,800억' },
 ]
},
{
sector: '유리기판',
sectorColor: '#74b9ff',
sectorVolume: '2,800억',
news: 'SKC solmics 유리기판 美 고객사 샘플 최종 통과... 양산 계약 임박',
newsSource: '전자신문 | 1시간 전',
stocks: [
{ name: 'SKC', code: '011790', baseSector: '화학', flowTheme: '유리기판', price: 52300, change: 8.2, volume: '2,100억' },
{ name: '원익IPS', code: '240810', baseSector: '반도체소재', flowTheme: '유리기판', price: 34800, change: 3.5, volume: '480억' },
 ]
},
{
sector: '솔리드배터리',
sectorColor: '#4ecdc4',
sectorVolume: '1.1조',
news: '삼성SDI 솔리드배터리 샘플 美 자동차 업체에 공급 시작... 상용화 임박',
newsSource: '전자신문 | 4시간 전',
stocks: [
{ name: '에코프로비엠', code: '247540', baseSector: '2차전지', flowTheme: '솔리드배터리', price: 228500, change: 6.3, volume: '3,400억' },
{ name: '포스코퓨처엠', code: '003670', baseSector: '2차전지', flowTheme: '2차전지', price: 342000, change: 2.1, volume: '2,100억' },
 ]
},
{
sector: '원전',
sectorColor: '#ffe66d',
sectorVolume: '4,800억',
news: '정부 신규 원전 2기 추가 건설 검토... 탄소중립 로드맵 재검토',
newsSource: '연합뉴스 | 1시간 전',
stocks: [
{ name: '두산에너빌리티', code: '034020', baseSector: '기계', flowTheme: '원전', price: 18250, change: 3.5, volume: '1,500억' },
{ name: '한전기술', code: '052690', baseSector: '전기공사', flowTheme: '원전', price: 42800, change: 2.8, volume: '980억' },
 ]
}
],
swing: {
summary: { days: 18, stocks: 142, sectors: 12 },
calendar: [
{ date: '0501', day: 1, heat: 'high', sector: 'AI반도체', ratio: 38, dot: 'dot-ai' },
{ date: '0502', day: 2, heat: 'mid', sector: '솔리드배터리', ratio: 22, dot: 'dot-battery' },
{ date: '0505', day: 5, heat: 'low', sector: '원전', ratio: 15, dot: 'dot-nuclear' },
{ date: '0506', day: 6, heat: 'high', sector: 'AI반도체', ratio: 35, dot: 'dot-ai' },
{ date: '0507', day: 7, heat: 'mid', sector: 'AI반도체', ratio: 28, dot: 'dot-ai' },
{ date: '0508', day: 8, heat: 'low', sector: '바이오', ratio: 12, dot: 'dot-bio', today: true },
{ date: '0509', day: 9, heat: 'high', sector: 'AI반도체', ratio: 42, dot: 'dot-ai' },
{ date: '0512', day: 12, heat: 'none', sector: '분산', ratio: 8, dot: '' },
 ],
dayDetail: {
'0508': {
topSector: '바이오',
topRatio: 12,
bannerClass: 'bio',
news: '셀트리온 바이오시밀러 美 FDA 최종 승인... 글로벌 시장 진출 가속화',
newsSource: '머니투데이',
summary: { sectors: 8, stocks: 42, volume: '7.2조' },
sectors: [
{
name: '바이오',
icon: '🧬',
color: '#a8e6cf',
total: '8,600억 (12%)',
stocks: [
{ name: '셀트리온', tag: '바이오', tagType: 'flow', change: 3.2, volume: '3,200억' },
{ name: '삼성바이오로직스', tag: '바이오', tagType: 'base', change: 2.1, volume: '2,800억' },
 ]
},
{
name: 'AI반도체',
icon: '🔥',
color: '#ff6b6b',
total: '6.8조 (9.4%)',
stocks: [
{ name: '삼성전자', tag: 'AI반도체', tagType: 'flow', change: 1.2, volume: '4,500억' },
{ name: 'SK하이닉스', tag: 'AI반도체', tagType: 'flow', change: 0.8, volume: '2,300억' },
 ]
}
]
}
}
}
};

// ===== PIN 보호 =====
const CORRECT_PIN = '1234';

// ===== 컴포넌트 =====
export default function StockAnalyzer() {
const [isDark, setIsDark] = useState(true);
const [activeTab, setActiveTab] = useState<'short' | 'swing'>('short');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [pin, setPin] = useState('');
const [modalDate, setModalDate] = useState<string | null>(null);
const [tooltip, setTooltip] = useState<{show: boolean, text: string, x: number, y: number}>({show: false, text: '', x: 0, y: 0});
const [seconds, setSeconds] = useState(60);

// 1분 카운트다운
useEffect(() => {
const timer = setInterval(() => {
setSeconds(s => s <= 1 ? 60 : s - 1);
}, 1000);
return () => clearInterval(timer);
}, []);

// PIN 체크
const handleLogin = () => {
if (pin === CORRECT_PIN) {
setIsLoggedIn(true);
} else {
alert('PIN이 틀렸습니다. 기본: 1234');
}
};

// 테마 토글
const toggleTheme = () => setIsDark(!isDark);

// 툴팁
const showTooltip = (e: React.TouchEvent | React.MouseEvent, text: string) => {
const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
setTooltip({ show: true, text, x: clientX, y: clientY - 50 });
};
const hideTooltip = () => setTooltip(t => ({...t, show: false}));

// 날짜 클릭
const openModal = (date: string) => setModalDate(date);
const closeModal = () => setModalDate(null);

// 로그인 화면
if (!isLoggedIn) {
return (
<div style={{
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
height: '100vh',
background: isDark ? '#0a0e1a' : '#f5f7fa',
transition: 'background 0.3s'
}}>
<div style={{ textAlign: 'center', width: '80%', maxWidth: '300px' }}>
<h2 style={{
color: isDark ? '#fff' : '#1a1a2e',
marginBottom: '30px',
fontSize: '24px'
}}>🔒 주식 분석기</h2>
<input
type="password"
value={pin}
onChange={(e) => setPin(e.target.value)}
placeholder="PIN 입력 (4자리)"
maxLength={4}
style={{
width: '100%',
padding: '16px',
fontSize: '20px',
borderRadius: '12px',
border: 1px solid ${isDark ? '#2a3050' : '#c8d0d8'}`,
background: isDark ? '#13182b' : '#fff',
color: isDark ? '#fff' : '#1a1a2e',
textAlign: 'center',
marginBottom: '16px',
outline: 'none'
}}
/>
<button
onClick={handleLogin}
style={{
width: '100%',
padding: '16px',
background: '#64ffda',
border: 'none',
borderRadius: '12px',
fontSize: '18px',
fontWeight: '700',
color: '#0a0e1a',
cursor: 'pointer'
}}
>
입장
</button>
<p style={{
color: isDark ? '#8892b0' : '#5a6a7a',
fontSize: '12px',
marginTop: '16px'
}}>
기본 PIN: 1234<br/>나중에 config.json에서 변경 가능
</p>
</div>
</div>
);
}

// 메인 화면
return (
<div style={{
background: isDark ? '#0a0e1a' : '#f5f7fa',
color: isDark ? '#fff' : '#1a1a2e',
minHeight: '100vh',
transition: 'background 0.3s, color 0.3s'
}}>
{/* 툴팁 */}
{tooltip.show && (
<div style={{
position: 'fixed',
left: tooltip.x,
top: tooltip.y,
background: isDark ? '#1e2642' : '#e8ecf4',
border: 1px solid${isDark ? '#2a3050' : '#c8d0d8'}`,
borderRadius: '8px',
padding: '8px 12px',
fontSize: '12px',
color: isDark ? '#8892b0' : '#5a6a7a',
zIndex: 9999,
whiteSpace: 'nowrap',
boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
}}>
{tooltip.text}
</div>
)}

{/* 헤더 */}
<div style={{
background: isDark ? 'linear-gradient(135deg, #1a1f3a 0%, #0d1120 100%)' : 'linear-gradient(135deg, #e8ecf4 0%, #d1d9e6 100%)',
padding: '12px 16px',
borderBottom: 1px solid ${isDark ? '#2a3050' : '#c8d0d8'}, position: 'sticky', top: 0, zIndex: 100 }}&gt; &lt;div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}&gt; &lt;div style={{ fontSize: '18px', fontWeight: 700 }}&gt;📊 주식 분석기&lt;/div&gt; &lt;div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}&gt; &lt;button onClick={toggleTheme} style={{ background: 'transparent', border:1px solid ${isDark ? '#2a3050' : '#c8d0d8'},
color: isDark ? '#8892b0' : '#5a6a7a',
padding: '6px 12px',
borderRadius: '8px',
fontSize: '12px',
cursor: 'pointer'
}}
>
{isDark ? '☀️ 라이트' : '🌙 다크'}
</button>
<div style={{
background: '#ff4757',
color: '#fff',
padding: '3px 10px',
borderRadius: '12px',
fontSize: '11px',
fontWeight: 600
}}>LIVE</div>
</div>
</div>
<div style={{
display: 'flex',
justifyContent: 'space-between',
marginTop: '8px',
fontSize: '12px',
color: isDark ? '#8892b0' : '#5a6a7a'
}}>
<span>14:32:07 기준</span>
<span style={{ color: '#64ffda' }}>
다음 갱신: {Math.floor(seconds/60)}:{(seconds%60).toString().padStart(2,'0')}
</span>
</div>
</div>

{/* 탭 */}
<div style={{
display: 'flex',
background: isDark ? '#13182b' : '#fff',
borderBottom: 1px solid ${isDark ? '#2a3050' : '#c8d0d8'}}}&gt; {(['short', 'swing'] as const).map((tab) =&gt; ( &lt;button key={tab} onClick={() =&gt; setActiveTab(tab)} style={{ flex: 1, padding: '14px', textAlign: 'center', fontSize: '14px', border: 'none', borderBottom:2px solid ${activeTab === tab ? '#64ffda' : 'transparent'},
background: 'transparent',
color: activeTab === tab ? '#64ffda' : isDark ? '#8892b0' : '#5a6a7a',
fontWeight: activeTab === tab ? 600 : 400,
cursor: 'pointer'
}}
>
{tab === 'short' ? '⚡ 단타 (실시간)' : '📈 단기스윙'}
</button>
))}
</div>

{/* 단타 화면 /}
{activeTab === 'short' && (
<div>
{/ 어제 수급 테마 */}
<div style={{
background: isDark ? 'rgba(255,107,107,0.1)' : 'rgba(255,71,87,0.1)',
border: 1px solid ${isDark ? 'rgba(255,107,107,0.2)' : 'rgba(255,71,87,0.2)'}`,
borderRadius: '12px',
padding: '12px 16px',
margin: '12px 16px',
fontSize: '13px',
color: isDark ? '#ff6b6b' : '#c0392b'
}}>
<strong>📌 어제 핫 수급 테마:</strong> AI반도체, 솔리드배터리, 원전
</div>

<div style={{
textAlign: 'center',
fontSize: '11px',
color: isDark ? '#8892b0' : '#5a6a7a',
padding: '8px 16px',
opacity: 0.7
}}>
💡 태그를 길게 누르면 전통 업종이 표시됩니다
</div>

{/* 섹터 목록 /}
{MOCK_STOCKS.short.map((sector, idx) => (
<div key={idx} style={{ marginBottom: '16px' }}>
{/ 섹터 헤더 */}
<div style={{
background: isDark ? 'linear-gradient(90deg, #1a1f3a 0%, #13182b 100%)' : 'linear-gradient(90deg, #e8ecf4 0%, #fff 100%)',
padding: '12px 16px',
borderLeft: 3px solid${sector.sectorColor}`,
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center'
}}>
<div>
<div style={{ fontSize: '15px', fontWeight: 700 }}>{sector.sector}</div>
<div style={{ fontSize: '12px', color: isDark ? '#8892b0' : '#5a6a7a' }}>
총 거래대금: <span style={{ color: '#64ffda', fontWeight: 600 }}>{sector.sectorVolume}</span>
</div>
</div>
</div>

{/* 뉴스 */}
<div style={{
margin: '8px 16px 0',
padding: '10px 14px',
background: isDark ? 'rgba(255,230,109,0.08)' : 'rgba(243,156,18,0.1)',
border: 1px solid ${isDark ? 'rgba(255,230,109,0.2)' : 'rgba(243,156,18,0.2)'}`,
borderRadius: '10px',
fontSize: '12px',
lineHeight: 1.5,
color: isDark ? '#ffe66d' : '#d68910',
display: 'flex',
alignItems: 'flex-start',
gap: '8px'
}}>
<span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>📰</span>
<div>
<div>{sector.news}</div>
<div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>{sector.newsSource}</div>
</div>
</div>

{/* 종목 카드 */}
<div style={{ padding: '0 16px' }}>
{sector.stocks.map((stock, sidx) => (
<div
key={sidx}
style={{
background: isDark ? '#13182b' : '#fff',
borderRadius: '12px',
padding: '14px 16px',
margin: '8px 0',
display: 'grid',
gridTemplateColumns: '1fr auto auto',
gap: '12px',
alignItems: 'center',
border: 1px solid${isDark ? '#1e2642' : '#e0e4e8'}}} &gt; &lt;div&gt; &lt;div style={{ fontSize: '15px', fontWeight: 600 }}&gt;{stock.name}&lt;/div&gt; &lt;div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}&gt; &lt;span onTouchStart={(e) =&gt; showTooltip(e,📌 전통 업종: latex
{stock.baseSector}`)} onTouchEnd={hideTooltip} onMouseEnter={(e) =&gt; showTooltip(e, `📌 전통 업종: 

{stock.baseSector})} onMouseLeave={hideTooltip} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', fontWeight: 500, background: isDark ? 'rgba(255,107,107,0.15)' : 'rgba(255,71,87,0.1)', color: isDark ? '#ff6b6b' : '#c0392b', border:1px solid ${isDark ? 'rgba(255,107,107,0.3)' : 'rgba(255,71,87,0.2)'},
cursor: 'pointer',
userSelect: 'none',
WebkitTouchCallout: 'none'
}}
>
{stock.flowTheme}
</span>
</div>
</div>
<div style={{ textAlign: 'right' }}>
<div style={{ fontSize: '16px', fontWeight: 700 }}>{stock.price.toLocaleString()}</div>
<div style={{ fontSize: '13px', fontWeight: 600, color: '#ff4757', marginTop: '2px' }}>
+{stock.change}%
</div>
</div>
<div style={{ textAlign: 'right', minWidth: '80px' }}>
<div style={{ fontSize: '10px', color: isDark ? '#8892b0' : '#5a6a7a' }}>거래대금</div>
<div style={{ fontSize: '14px', fontWeight: 600 }}>{stock.volume}</div>
</div>
</div>
))}
</div>
</div>
))}
</div>
)}

{/* 단기스윙 화면 /}
{activeTab === 'swing' && (
<div>
{/ 상단 요약 */}
<div style={{
background: isDark ? 'linear-gradient(135deg, #1a1f3a 0%, #0d1120 100%)' : 'linear-gradient(135deg, #e8ecf4 0%, #d1d9e6 100%)',
margin: '12px 16px',
borderRadius: '16px',
padding: '16px',
border: 1px solid${isDark ? '#2a3050' : '#c8d0d8'}`
}}>
<div style={{ fontSize: '14px', color: isDark ? '#8892b0' : '#5a6a7a', marginBottom: '12px' }}>
📅 2026년 5월 단기스윙 분석
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
{[
{ value: MOCK_STOCKS.swing.summary.days, label: '분석 거래일' },
{ value: MOCK_STOCKS.swing.summary.stocks, label: '선별 종목' },
{ value: MOCK_STOCKS.swing.summary.sectors, label: '활성 섹터' }
 ].map((stat, i) => (
<div key={i} style={{ textAlign: 'center' }}>
<div style={{ fontSize: '20px', fontWeight: 700, color: '#64ffda' }}>{stat.value}</div>
<div style={{ fontSize: '11px', color: isDark ? '#8892b0' : '#5a6a7a', marginTop: '4px' }}>{stat.label}</div>
</div>
))}
</div>
</div>

{/* 범례 */}
<div style={{ padding: '0 16px 16px', fontSize: '12px', color: isDark ? '#8892b0' : '#5a6a7a' }}>
{[
{ color: 'rgba(255,71,87,0.4)', text: '🔥 30% 이상 - 압도적 주도' },
{ color: 'rgba(255,165,2,0.3)', text: '⚡ 20~30% - 뚜렷한 주도' },
{ color: 'rgba(255,230,109,0.25)', text: '📊 10~20% - 경쟁 활발' },
{ color: 'rgba(46,213,115,0.15)', text: '🍃 10% 미만 - 테마 분산' }
 ].map((item, i) => (
<div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
<div style={{ width: '20px', height: '12px', borderRadius: '3px', marginRight: '8px', background: item.color }}></div>
<span style={{ fontSize: '11px' }}>{item.text}</span>
</div>
))}
</div>

{/* 캘린더 */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', padding: '16px' }}>
{['일', '월', '화', '수', '목', '금', '토'].map(d => (
<div key={d} style={{ textAlign: 'center', fontSize: '11px', color: isDark ? '#8892b0' : '#5a6a7a', padding: '8px 0' }}>{d}</div>
))}

{/* 빈칸 (4월 말) */}
{[27, 28, 29, 30].map(d => (
<div key={empty-${d}} style={{ aspectRatio: '1', opacity: 0.3 }}&gt; &lt;div style={{ background: isDark ? '#13182b' : '#fff', borderRadius: '8px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border:1px solid ${isDark ? '#1e2642' : '#e0e4e8'}
}}>
{d}
</div>
</div>
))}

{/* 실제 날짜 /}
{MOCK_STOCKS.swing.calendar.map((day) => {
const heatClass = day.heat;
const isToday = day.today;
return (
<div
key={day.date}
onClick={() => day.sector !== '분산' && openModal(day.date)}
style={{
aspectRatio: '1',
position: 'relative',
borderRadius: '8px',
overflow: 'hidden',
cursor: day.sector !== '분산' ? 'pointer' : 'default',
border: 1px solid ${isToday ? '#64ffda' : isDark ? '#1e2642' : '#e0e4e8'}`,
background: isDark ? '#13182b' : '#fff'
}}
>
{/ 히트맵 배경 */}
<div style={{
position: 'absolute',
top: 0, left: 0, right: 0, bottom: 0,
opacity: heatClass === 'high' ? 0.4 : heatClass === 'mid' ? 0.3 : heatClass === 'low' ? 0.25 : 0.15,
background: heatClass === 'high' ? '#ff4757' : heatClass === 'mid' ? '#ffa502' : heatClass === 'low' ? '#ffe66d' : '#2ed573'
}}></div>

<div style={{
position: 'relative',
zIndex: 2,
height: '100%',
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center'
}}>
<span style={{
fontWeight: 600,
color: isToday ? '#64ffda' : isDark ? '#fff' : '#1a1a2e'
}}>{day.day}</span>
{day.dot && (
<div style={{
position: 'absolute',
bottom: '4px',
width: '6px',
height: '6px',
borderRadius: '50%',
background: day.dot === 'dot-ai' ? '#ff6b6b' : day.dot === 'dot-battery' ? '#4ecdc4' : day.dot === 'dot-nuclear' ? '#ffe66d' : day.dot === 'dot-bio' ? '#a8e6cf' : '#ff9ff3'
}}></div>
)}
</div>
</div>
);
})}

{/* 나머지 빈칸 */}
{[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map(d => (
<div key={rest-${d}} style={{ aspectRatio: '1' }}&gt; &lt;div style={{ background: isDark ? '#13182b' : '#fff', borderRadius: '8px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border:1px solid ${isDark ? '#1e2642' : '#e0e4e8'}
}}>
{d}
</div>
</div>
))}
</div>
</div>
)}

{/* 모달 (날짜 상세) /}
{modalDate && MOCK_STOCKS.swing.dayDetail[modalDate] && (
<div style={{
position: 'fixed',
top: 0, left: 0, right: 0, bottom: 0,
background: isDark ? '#0a0e1a' : '#f5f7fa',
zIndex: 200,
overflowY: 'auto'
}}>
{/ 모달 헤더 */}
<div style={{
background: isDark ? 'linear-gradient(135deg, #1a1f3a 0%, #0d1120 100%)' : 'linear-gradient(135deg, #e8ecf4 0%, #d1d9e6 100%)',
padding: '16px',
borderBottom: 1px solid${isDark ? '#2a3050' : '#c8d0d8'}, position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}&gt; &lt;div style={{ fontSize: '18px', fontWeight: 700 }}&gt;5월 {modalDate.slice(2)}일 단기스윙 분석&lt;/div&gt; &lt;button onClick={closeModal} style={{ background: isDark ? '#13182b' : '#fff', border:1px solid ${isDark ? '#2a3050' : '#c8d0d8'},
color: isDark ? '#fff' : '#1a1a2e',
width: '32px',
height: '32px',
borderRadius: '50%',
fontSize: '18px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
cursor: 'pointer'
}}
>
✕
</button>
</div>

{(() => {
const detail = MOCK_STOCKS.swing.dayDetail[modalDate]!;
return (
<>
{/* 1등 섹터 배너 */}
<div style={{
margin: '0 16px 12px',
padding: '10px 16px',
borderRadius: '10px',
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
background: detail.bannerClass === 'bio' ? 'rgba(168,230,207,0.15)' : detail.bannerClass === 'ai' ? 'rgba(255,107,107,0.15)' : 'rgba(78,205,196,0.15)',
border: 1px solid${detail.bannerClass === 'bio' ? 'rgba(168,230,207,0.3)' : detail.bannerClass === 'ai' ? 'rgba(255,107,107,0.3)' : 'rgba(78,205,196,0.3)'}`
}}>
<div>
<div style={{ fontSize: '12px', color: isDark ? '#8892b0' : '#5a6a7a' }}>🏆 1등 섹터</div>
<div style={{ fontSize: '14px', fontWeight: 700 }}>{detail.topSector}</div>
</div>
<div style={{ fontSize: '16px', fontWeight: 700, color: detail.bannerClass === 'bio' ? '#a8e6cf' : detail.bannerClass === 'ai' ? '#ff6b6b' : '#4ecdc4' }}>
{detail.topRatio}%
</div>
</div>

{/* 요약 */}
<div style={{
padding: '16px',
background: isDark ? '#13182b' : '#fff',
margin: '12px 16px',
borderRadius: '12px',
border: 1px solid ${isDark ? '#2a3050' : '#c8d0d8'}`
}}>
<div style={{ fontSize: '13px', color: isDark ? '#8892b0' : '#5a6a7a', marginBottom: '8px' }}>📊 당일 시장 요약</div>
<div style={{ display: 'flex', gap: '16px' }}>
{[
{ value: detail.summary.sectors, label: '활성 섹터' },
{ value: detail.summary.stocks, label: '선별 종목' },
{ value: detail.summary.volume, label: '총 거래대금' }
 ].map((s, i) => (
<div key={i}>
<div style={{ fontSize: '16px', fontWeight: 700, color: '#64ffda' }}>{s.value}</div>
<div style={{ fontSize: '11px', color: isDark ? '#8892b0' : '#5a6a7a' }}>{s.label}</div>
</div>
))}
</div>
</div>

{/* 뉴스 */}
<div style={{
margin: '0 16px 16px',
padding: '12px 14px',
background: isDark ? 'rgba(255,230,109,0.08)' : 'rgba(243,156,18,0.1)',
border: 1px solid${isDark ? 'rgba(255,230,109,0.2)' : 'rgba(243,156,18,0.2)'}`,
borderRadius: '10px',
fontSize: '12px',
lineHeight: 1.5,
color: isDark ? '#ffe66d' : '#d68910'
}}>
<div style={{ fontSize: '11px', color: isDark ? '#8892b0' : '#5a6a7a', marginBottom: '6px', fontWeight: 600 }}>📰 1등 섹터 핵심 뉴스</div>
<div>{detail.news}</div>
<div style={{ fontSize: '10px', opacity: 0.7, marginTop: '6px' }}>출처: {detail.newsSource} | 2026.05.{modalDate.slice(2)}</div>
</div>

{/* 섹터별 종목 */}
{detail.sectors.map((sector, idx) => (
<div key={idx} style={{ marginBottom: '20px' }}>
<div style={{
padding: '12px 16px',
background: isDark ? 'linear-gradient(90deg, #1a1f3a 0%, #13182b 100%)' : 'linear-gradient(90deg, #e8ecf4 0%, #fff 100%)',
borderLeft: 3px solid ${sector.color}, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}&gt; &lt;div style={{ fontSize: '15px', fontWeight: 700 }}&gt;{sector.icon} {sector.name}&lt;/div&gt; &lt;div style={{ fontSize: '12px', color: isDark ? '#8892b0' : '#5a6a7a' }}&gt; 총 &lt;span style={{ color: '#64ffda', fontWeight: 600 }}&gt;{sector.total}&lt;/span&gt; &lt;/div&gt; &lt;/div&gt; &lt;div style={{ padding: '0 16px' }}&gt; {sector.stocks.map((stock, sidx) =&gt; ( &lt;div key={sidx} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom:1px solid ${isDark ? '#1e2642' : '#e0e4e8'}
}}>
<div style={{ fontSize: '14px', fontWeight: 600 }}>{stock.name}</div>
<span style={{
fontSize: '10px',
padding: '2px 6px',
borderRadius: '4px',
fontWeight: 500,
background: stock.tagType === 'flow' ? (isDark ? 'rgba(255,107,107,0.15)' : 'rgba(255,71,87,0.1)') : (isDark ? 'rgba(100,255,218,0.1)' : 'rgba(0,184,148,0.1)'),
color: stock.tagType === 'flow' ? (isDark ? '#ff6b6b' : '#c0392b') : (isDark ? '#64ffda' : '#00b894')
}}>
{stock.tag}
</span>
<div style={{ fontSize: '14px', fontWeight: 600, color: '#ff4757', textAlign: 'right', minWidth: '50px' }}>
+{stock.change}%
</div>
<div style={{ fontSize: '13px', color: isDark ? '#8892b0' : '#5a6a7a', textAlign: 'right', minWidth: '70px' }}>
{stock.volume}
</div>
</div>
))}
</div>
</div>
))}
</>
);
})()}
</div>
)}

{/* 새로고침 버튼 */}
<button
onClick={() => {
setSeconds(60);
alert('데이터 갱신 중... (실제 연동 시 1분 자동 갱신)');
}}
style={{
position: 'fixed',
bottom: '20px',
right: '20px',
width: '56px',
height: '56px',
borderRadius: '50%',
background: 'linear-gradient(135deg, #64ffda 0%, #00b894 100%)',
border: 'none',
color: '#0a0e1a',
fontSize: '20px',
fontWeight: 700,
boxShadow: '0 4px 20px rgba(100,255,218,0.3)',
zIndex: 150,
cursor: 'pointer'
}}
>
↻
</button>
</div>
);
}
