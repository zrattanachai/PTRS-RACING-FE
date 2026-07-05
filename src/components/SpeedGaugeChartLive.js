import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SpeedGaugeChart = ({ value, name, unit }) => {
  return (
    <div style={{ width: '100%', height: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', borderRadius: '50%' }} className='mb-2'>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="speedGradientColor" x1="0%" y1="0%" x2="40%" y2="0%" gradientTransform={`rotate(130)`}>
            <stop offset="0" stopColor="#c1ff00" />
            <stop offset="1" stopColor="#c1ff00" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgressbarWithChildren
        value={value}
        text={value.toString()}
        maxValue={220}
        circleRatio={0.75}
        strokeWidth={5}
        background={true}
        backgroundPadding={10}
        styles={buildStyles({
          // pathColor: value < 16 ? 'green' : 'red',
          pathColor: "url(#speedGradientColor)",
          trailColor: '#262626',
          strokeLinecap: 'round',
          rotation: 0.625,
          backgroundColor: '#242424',
          textColor: '#ffffff',
          textSize: '2.5rem'
        })}
      >
        {/* <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ffffff' }}>
          {value}
        </div> */}

        <div className='unit-text ' style={{ fontSize: '1rem', color: '#ffffff' }}>
          {unit}
        </div>

        <div className='name-text' style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#c0ff00' }}>
          {name}
        </div>
      </CircularProgressbarWithChildren>
      <style jsx="true">{`
        .unit-text {
          position: absolute;
          bottom: 25%; /* เดิม 25% → ลดลงเพื่อเพิ่มช่องว่าง */
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }


        .name-text {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default SpeedGaugeChart;
