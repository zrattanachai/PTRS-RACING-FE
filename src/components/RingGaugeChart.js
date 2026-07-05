// components/RingGaugeChart.js
import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GradientSVG from './gradientSVG';

const RingGaugeChart = ({ value, name, unit }) => {
  return (
    <div style={{ width: '100%', height: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', borderRadius: '50%' }} className='mb-2'>
      <GradientSVG />
      <CircularProgressbarWithChildren
        value={value}
        text={value.toString()}
        maxValue={20}
        circleRatio={0.75}
        strokeWidth={5}
        background={true}
        backgroundPadding={10}
        styles={buildStyles({
          // pathColor: value < 16 ? 'green' : 'red',
          pathColor: "url(#gradientColor)",
          trailColor: '#262626',
          strokeLinecap: 'round',
          rotation: 0.625,
          backgroundColor: '#242424',
          textColor: '#ffffff',
          textSize: '3rem'
        })}
      >
        {/* <div className="value-text" style={{ fontSize: '0.438rem', color: '#ffffff' }}>
              {value}
          </div> */}
          
          <div className='unit-text' style={{ fontSize: '0.6rem', color: '#ffffff' }}>
            {unit}
          </div>

          <div className='name-text' style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#c0ff00' }}>
            {name}
          </div>
      </CircularProgressbarWithChildren>
      <style jsx="true">{`
        .unit-text {
          position: absolute;
          bottom: 22%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .name-text {
          position: absolute;
          bottom: 7%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default RingGaugeChart;
// @media (max-width: 600px) {
//   .bottom-text div {
//     font-size: 12px;
//   }
// }

// @media (min-width: 601px) and (max-width: 1200px) {
//   .bottom-text div {
//     font-size: 7px;
//   }
// }

// @media (min-width: 1201px) {
//   .bottom-text div {
//     font-size: 7px;
//   }
// }