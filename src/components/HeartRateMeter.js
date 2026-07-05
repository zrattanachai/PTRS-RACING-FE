import React from 'react';

const HeartRateMeter = ({ value = 0, unit = "BPM" }) => {
  // Heart rate zones based on standard classifications
  const getZoneInfo = (heartRate) => {
    if (heartRate < 60) return { color: '#6c757d', text: 'RESTING', desc: 'Recovery' };
    if (heartRate < 100) return { color: '#2ecc71', text: 'NORMAL', desc: 'Warm Up' };
    if (heartRate < 130) return { color: '#3498db', text: 'AEROBIC', desc: 'Fat Burn' };
    if (heartRate < 150) return { color: '#f1c40f', text: 'ENDURANCE', desc: 'Cardio' };
    if (heartRate < 170) return { color: '#e67e22', text: 'ANAEROBIC', desc: 'Performance' };
    return { color: '#e74c3c', text: 'MAX', desc: 'Peak' };
  };

  const { color, text, desc } = getZoneInfo(value);

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '12px',
      padding: '12px', // ลดลงจาก 15px
      width: '100%',
      height: '100%', // เปลี่ยนจาก 140px เป็น 100%
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between', // เปลี่ยนจาก center
      border: `2px solid ${color}`,
      boxShadow: `0 0 20px ${color}30`,
      overflow: 'hidden' // เพิ่มเพื่อป้องกันเนื้อหาล้น
    }}>
      {/* Header */}
      <div style={{
        fontSize: '0.8rem', // ลดขนาดลง
        color: '#fff',
        marginBottom: '2px', // ลดลงจาก 5px
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '600'
      }}>
        Heart Rate Monitor
      </div>

      {/* Main Value */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px', // ลดลงจาก 15px
        marginBottom: '5px' // ลดลงจาก 10px
      }}>
        <div style={{
          fontSize: '3rem', // ลดลงจาก 3.5rem
          fontWeight: 'bold',
          color: color,
          fontFamily: 'monospace',
          textShadow: `0 0 10px ${color}50`
        }}>
          {value.toString().padStart(3, '0')}
        </div>
        <div style={{
          fontSize: '1rem', // ลดลงจาก 1.2rem
          color: '#ffffff80',
          fontWeight: '500'
        }}>
          {unit}
        </div>
      </div>

      {/* Zone Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px', // ลดลงจาก 10px
        fontSize: '0.9rem' // ลดขนาดลง
      }}>
        <div style={{
          padding: '3px 10px', // ลดลงจาก 4px 12px
          backgroundColor: `${color}20`,
          border: `2px solid ${color}`,
          borderRadius: '6px',
          color: color,
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {text}
        </div>
        <div style={{
          color: '#ffffff80',
          fontSize: '0.8rem' // ลดลงจาก 0.9rem
        }}>
          {desc} Zone
        </div>
        
        {/* Live Indicator */}
        <div style={{
          marginLeft: 'auto',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: value > 0 ? '#00ff00' : '#666',
          boxShadow: value > 0 ? '0 0 10px #00ff00' : 'none',
          animation: value > 0 ? 'blink 1s ease-in-out infinite' : 'none'
        }} />
      </div>

      <style jsx="true">{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default HeartRateMeter;