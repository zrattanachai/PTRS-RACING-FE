// HeartRateMeterGlow.js
import React, { useMemo } from 'react';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function zoneFromPct(pct) {
  if (pct < 0.50) return { key: 'Resting', color: '#93c5fd' };     // ฟ้าอ่อน
  if (pct < 0.60) return { key: 'Warm-up', color: '#2dd4bf' };     // teal
  if (pct < 0.70) return { key: 'Fat Burn', color: '#22c55e' };    // green
  if (pct < 0.80) return { key: 'Aerobic',  color: '#eab308' };    // yellow
  if (pct < 0.90) return { key: 'Anaerobic',color: '#f97316' };    // orange
  return { key: 'Max',     color: '#ef4444' };                      // red
}

export default function HeartRateMeterGlow({
  value = 0,
  maxHr = 190,
  unit = 'BPM',
  accent = '#c1fe00',   // เขียวเรือง
  height = 160,
  showGrid = true,
}) {
  const pct = clamp(maxHr ? value / maxHr : 0, 0, 1);
  const zone = useMemo(() => zoneFromPct(pct), [pct]);
  const big = useMemo(() => Math.round(value).toString(), [value]);

  // สัดส่วนภายใน (ตามความสูงที่ส่งมา)
  const heartSize = Math.round(clamp(height * 0.34, 34, 72));
  const numberSize = `clamp(28px, ${Math.round(height * 0.33)}px, 56px)`;
  const cardPad = Math.round(clamp(height * 0.10, 10, 16));

  return (
    <div style={{
      position:'relative',
      width:'100%', height:'100%',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between',
      padding: cardPad, boxSizing:'border-box',
      background:'rgba(0,0,0,.65)',
      borderRadius: 10,
      border: `2px solid ${accent}40`,
      overflow:'hidden',
    }}>
      {/* grid เส้นบาง ๆ ตามตัวอย่าง */}
      {showGrid && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: .25
        }}/>
      )}

      {/* หัวใจ + glow */}
      <div style={{ position:'relative', height: heartSize, marginTop: 2 }}>
        <div style={{
          position:'absolute',
          left:'50%', top:'50%', transform:'translate(-50%,-50%)',
          width: heartSize * 1.8, height: heartSize * 1.8,
          borderRadius:'50%',
          background: accent, filter:'blur(18px)', opacity:.45,
          animation: value ? 'pulseGlow 2s ease-in-out infinite' : 'none'
        }}/>
        <svg width={heartSize} height={heartSize} viewBox="0 0 24 24"
             style={{ position:'relative', filter: `drop-shadow(0 0 8px ${accent})` }}>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={accent}
          />
        </svg>
      </div>

      {/* ตัวเลข + หน่วย */}
      <div style={{ textAlign:'center', marginTop: 4 }}>
        <div style={{
          fontSize: numberSize, lineHeight:1, fontWeight: 900,
          color:'#fff', textShadow:'0 2px 10px rgba(0,0,0,.7)'
        }}>{big}</div>
        <div style={{
          marginTop: 2,
          color:'#e5e7eb', fontWeight:800, letterSpacing:1, fontSize:14
        }}>{unit.toUpperCase()}</div>
      </div>

      {/* แถวล่าง: ซ้าย Zone, ขวา %MaxHR */}
      <div style={{
        marginTop: 6,
        width:'100%',
        display:'grid', gridTemplateColumns:'1fr 1fr',
        gap: 8, alignItems:'end'
      }}>
        <div style={{ textAlign:'left' }}>
          <div style={{ color: accent, fontWeight:700 }}>{zone.key}</div>
          <div style={{ color:'#cbd5e1', fontSize:12, opacity:.9 }}>Zone</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ color: accent, fontWeight:700 }}>{Math.round(pct*100)}%</div>
          <div style={{ color:'#cbd5e1', fontSize:12, opacity:.9 }}>Max HR</div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes pulseGlow {
          0%,100% { transform: translate(-50%,-50%) scale(0.95); opacity:.35; }
          50%     { transform: translate(-50%,-50%) scale(1.05); opacity:.5; }
        }
      `}</style>
    </div>
  );
}
