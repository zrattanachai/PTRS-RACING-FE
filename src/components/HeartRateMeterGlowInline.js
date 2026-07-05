// HeartRateMeterGlowInline.js
import React, { useMemo, useRef, useEffect, useState } from 'react';

// ---------------- Utils ----------------
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// -------- Zone Presets (BPM-based, 5 โซนตายตัว) --------
// ปรับช่วง BPM ได้ตามต้องการ (ตอนนี้กำหนด 0–120–150–170–190–∞)
const BPM_BOUNDARIES = [0, 120, 150, 170, 190, Infinity]; // 5 ช่วง + ปลายบนเปิด

// helper: สร้างโซน BPM ด้วย label/color เดิม (ดีไซน์เดิม)
const makeBpmZones = (labels) =>
  labels.map((z, i) => ({
    id: z.id,
    from: BPM_BOUNDARIES[i],
    to: BPM_BOUNDARIES[i + 1],
    label: z.label,
    color: z.color,
  }));

// ดีไซน์เดิม (label/color เดิม) แต่ช่วงโซนเป็น BPM ตายตัว 5 โซน
const ZONES_MOTORSPORT = makeBpmZones([
  { id:'CALM',    label:'ZONE 1',    color:'#66e0ff' },
  { id:'FOCUS',   label:'ZONE 2',    color:'#00f929ff' },
  { id:'ALERT',   label:'ZONE 3',    color:'#fff200ff' },
  { id:'PUSH',    label:'ZONE 4',    color:'#ff9d00ff' },
  { id:'REDLINE', label:'ZONE 5',    color:'#ff0000ff' },
]);

const ZONES_BROADCAST = makeBpmZones([
  { id:'PIT',     label:'PIT',        color:'#93c5fd' },
  { id:'OUTLAP',  label:'OUT LAP',    color:'#2dd4bf' },
  { id:'RACE',    label:'RACE PACE',  color:'#22c55e' },
  { id:'ATTACK',  label:'ATTACK',     color:'#eab308' },
  { id:'QUALI',   label:'QUALI',      color:'#ef4444' },
]);

const ZONES_SCIENCE = makeBpmZones([
  { id:'Z1', label:'Z1 EASY',       color:'#93c5fd' },
  { id:'Z2', label:'Z2 STEADY',     color:'#2dd4bf' },
  { id:'Z3', label:'Z3 TEMPO',      color:'#22c55e' },
  { id:'Z4', label:'Z4 THRESHOLD',  color:'#eab308' },
  { id:'Z5', label:'Z5 MAX',        color:'#ef4444' },
]);

const getZones = (preset='motorsport') => {
  if (preset === 'broadcast') return ZONES_BROADCAST;
  if (preset === 'science')   return ZONES_SCIENCE;
  return ZONES_MOTORSPORT; // default
};

// ใช้ BPM ตรงๆ หาโซน (ไม่ใช้ % แล้ว)
const zoneFromHr = (hr, zones) =>
  zones.find(z => hr >= z.from && hr < z.to) || zones[zones.length - 1];

// --------------- Component ----------------
export default function HeartRateMeterGlowInline({
  value = 0,          // BPM ปัจจุบัน
  maxHr = 190,        // ใช้ทำสเกล % เกจเท่านั้น
  restingHr,          // คง prop ไว้เพื่อ compatibility แต่ "ไม่ใช้" ในการกำหนดโซน
  zonePreset = 'motorsport',
  unit = 'BPM',
  accent = '#c1fe00',
  height = 110,
  showGrid = false,
  showBar = true,
  stickBottom = false,
  // gauge tween
  gaugeAnimMsUp = 350,
  gaugeAnimMsDown = 450,
  smoothGauge = true,
  // zone FX
  zoneFx = true,
  zoneFxDuration = 900,
  invisible = false,
  backgroundColor = "transparent",
}) {
  const zones = useMemo(() => getZones(zonePreset), [zonePreset]);

  // ✅ เปอร์เซ็นต์เกจ = value / maxHr (เพื่อแสดงผลเท่านั้น)
  const pctTarget  = clamp(value / Math.max(1, maxHr), 0, 1);

  // ✅ หาโซนจาก "ค่า BPM ตรงๆ" (5 โซนตายตัว)
  const zone       = useMemo(() => zoneFromHr(value, zones), [value, zones]);
  const big        = useMemo(() => Math.round(value).toString(), [value]);

  const beatDur = `${clamp(60 / Math.max(value || 60, 40) * 2.5, 1.8, 3.5).toFixed(2)}s`;

  // sizing (ดีไซน์เดิม)
  const H = clamp(height, 70, 140);
  const padX = Math.round(H * 0.14);
  const padY = Math.round(H * 0.12);
  const heartSize  = Math.round(H * 0.58);
  const numberSize = `clamp(22px, ${Math.round(H * 0.44)}px, 54px)`;
  const unitSize   = Math.round(H * 0.20);
  const zoneSize   = Math.round(H * 0.24);
  const gap        = Math.round(H * 0.10);

  // ---------- Smooth gauge animation (ดีไซน์เดิม) ----------
  const [animatedPct, setAnimatedPct] = useState(pctTarget);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);
  const fromRef = useRef(animatedPct);

  useEffect(() => { fromRef.current = animatedPct; }, [animatedPct]);

  useEffect(() => {
    if (!smoothGauge) { setAnimatedPct(pctTarget); return; }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = fromRef.current;
    const to = pctTarget;
    const dur = to > from ? gaugeAnimMsUp : gaugeAnimMsDown;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    startTimeRef.current = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - startTimeRef.current) / Math.max(1, dur));
      const eased = easeOutCubic(p);
      const val = from + (to - from) * eased;
      setAnimatedPct(val);
      if (p < 1 && Math.abs(val - to) > 0.001) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [pctTarget, gaugeAnimMsUp, gaugeAnimMsDown, smoothGauge]);

  const gaugePct = smoothGauge ? animatedPct : pctTarget;

  // ---------- FX: when zone changes (ดีไซน์เดิม) ----------
  const prevZoneId = useRef(zone.id);
  const [fxActive, setFxActive] = useState(false);
  const [fxToken, setFxToken] = useState(0);

  useEffect(() => {
    if (!zoneFx) return;
    if (prevZoneId.current !== zone.id) {
      prevZoneId.current = zone.id;
      setFxActive(true);
      setFxToken((t) => t + 1);
      const tmr = setTimeout(() => setFxActive(false), zoneFxDuration);
      return () => clearTimeout(tmr);
    }
  }, [zone.id, zoneFx, zoneFxDuration]);

  // ring sweep geometry (ดีไซน์เดิม)
  const ringStroke = Math.max(2, Math.round(heartSize * 0.06));
  const ringSize = Math.round(heartSize * 0.92);
  const ringR = (ringSize - ringStroke) / 2;
  const ringC = 2 * Math.PI * ringR;

  // ถ้า value เป็น 0 หรือ invisible เป็น true ให้ซ่อน component
  if (value === 0 || invisible) {
    return (
      <div style={{
        width: '100%',
        height: height || 110,
        backgroundColor: '#0000ff', // สีเดียวกับ background
        opacity: 0, // ซ่อนทั้งหมด
        transition: 'opacity 0.3s ease'
      }}>
        {/* ส่วนนี้จะไม่แสดงเพราะ opacity = 0 */}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: H,
        padding: `${padY}px ${padX}px`,
        boxSizing: 'border-box',
        background: backgroundColor === 'transparent' ? '#242424' : backgroundColor, // ใช้สีเดิม #242424 แทน transparent
        borderRadius: 10,
        boxShadow: '0 3px 6px rgba(0,0,0,.45)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: `${heartSize}px minmax(110px, 1fr) 92px`,
        alignItems: 'center',
        columnGap: gap,
        alignSelf: stickBottom ? 'flex-end' : 'auto',
      }}
    >
      {/* Grid (ดีไซน์เดิม) */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),' +
              'linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            opacity: 0.18,
          }}
        />
      )}

      {/* LEFT: Heart + glow + FX + ECG (ดีไซน์เดิม) */}
      <div style={{ position: 'relative', width: heartSize, height: heartSize }}>
        <svg
          width={heartSize}
          height={heartSize}
          viewBox="0 0 24 24"
          style={{ 
            position: 'relative', 
            filter: `drop-shadow(0 0 3px ${zone.color}90)`,
            transition: 'filter 240ms ease',
            animation: value ? `heartbeat ${beatDur} ease-in-out infinite` : 'none'
          }}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={zone.color}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            left: '50%', 
            top: '50%', 
            transform: 'translate(-50%,-50%)',
            width: heartSize * 1,
            height: heartSize * 1,
            borderRadius: '50%',
            background: zone.color,
            filter: 'blur(6px)',
            opacity: 0.25,
            transition: 'background 240ms ease',
          }}
        />

        {zoneFx && fxActive && (
          <svg
            key={`ringsweep-${fxToken}`}
            width={ringSize} height={ringSize}
            viewBox={`0 0 ${ringSize} ${ringSize}`}
            style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }}
          >
            <circle
              cx={ringSize/2} cy={ringSize/2} r={ringR}
              fill="none"
              stroke={zone.color}
              strokeWidth={ringStroke}
              strokeLinecap="round"
              strokeDasharray={ringC}
              strokeDashoffset={ringC}
              style={{
                transform: `rotate(-90deg)`,
                transformOrigin: '50% 50%',
                animation: `ringSweep ${zoneFxDuration}ms ease-out forwards`,
                filter: `drop-shadow(0 0 6px ${zone.color})`,
              }}
            />
          </svg>
        )}

        {zoneFx && fxActive && (
          <div
            key={`ripple-${fxToken}`}
            style={{
              position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
              width: heartSize * 1.0, height: heartSize * 1.0,
              borderRadius:'50%', 
              border:`2px solid ${zone.color}`,
              animation: `zoneRipple ${zoneFxDuration}ms ease-out forwards`,
              boxShadow:`0 0 8px ${zone.color}`,
              pointerEvents:'none',
            }}
          />
        )}

        <svg
          width={Math.round(heartSize * 0.72)}
          height={Math.round(heartSize * 0.38)}
          viewBox="0 0 100 40"
          style={{
            position: 'absolute',
            left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
            animation: value ? `wavePulse ${beatDur} ease-in-out infinite` : 'none',
          }}
        >
          <path
            d="M0,20 L18,20 L28,8 L38,32 L48,14 L58,24 L68,20 L100,20"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.6))' }}
          />
        </svg>
      </div>

      {/* CENTER (ดีไซน์เดิม) */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap: Math.round(H * 0.08) }}>
          <span style={{
            color:'#fff', fontWeight:900, lineHeight:1,
            fontSize: numberSize, textShadow:'0 2px 10px rgba(0,0,0,.7)', whiteSpace:'nowrap',
          }}>{big}</span>
          <span style={{
            color:'#e5e7eb', fontWeight:800, letterSpacing:1,
            fontSize: unitSize, whiteSpace:'nowrap',
          }}>{unit.toUpperCase()}</span>
        </div>
        <div style={{
          marginTop: 4,
          color: zone.color, fontWeight: 800,
          fontSize: zoneSize, lineHeight: 0.3, whiteSpace: 'nowrap',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textShadow: fxActive ? `0 0 10px ${zone.color}` : 'none',
          animation: zoneFx && fxActive ? `zonePop 520ms cubic-bezier(.18,.89,.32,1.28)` : 'none',
          width: '100%', paddingRight: '0.08em',
        }}>
          {zone.label}
        </div>
      </div>

      {/* RIGHT: แสดง % ของ MaxHR (เพื่อภาพรวมเท่านั้น) */}
      <div style={{ justifySelf:'end', textAlign:'right' }}>
        <div style={{ color:'#cbd5e1', fontSize:12 }}>
          {Math.round(pctTarget*100)}% <span style={{ opacity:.9 }}>of Max HR</span>
        </div>
      </div>

      {/* keyframes (ดีไซน์เดิม) */}
      <style jsx="true">{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.08); }
          50% { transform: scale(1); }
          75% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes pulseGlowSoft {
          0%, 100% { transform: translate(-50%,-50%) scale(0.95); opacity:.20; }
          50% { transform: translate(-50%,-50%) scale(1.05); opacity:.30; }
        }
        @keyframes wavePulse {
          0%, 100% { transform: translate(-50%, -50%) scaleY(0.96); opacity:.95; }
          50%      { transform: translate(-50%, -50%) scaleY(1.06); opacity:1; }
        }
        @keyframes ringSweep {
          0%   { stroke-dashoffset: ${ringR * 2 * Math.PI}px; opacity: 1; }
          85%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes zoneRipple {
          0%   { transform: translate(-50%,-50%) scale(0.85); opacity:.55; }
          100% { transform: translate(-50%,-50%) scale(1.35); opacity:0; }
        }
        @keyframes zonePop {
          0%   { transform: translateY(2px) scale(0.94); opacity:.9; }
          60%  { transform: translateY(0)    scale(1.06); opacity:1; }
          100% { transform: translateY(0)    scale(1.00); opacity:1; }
        }
      `}</style>
    </div>
  );
}
