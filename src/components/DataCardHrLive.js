import React from 'react';
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
// import RingGaugeChart from './RingGaugeChart';
import SpeedGaugeChartHrLive from './SpeedGaugeChartHrLive';
import GForceMeterHr from './GForceMeterHr';
import HeartRateMeter from './HeartRateMeter';
import HeartRateMeterGlow from './HeartRateMeterGlow';
import HeartRateMeterGlowInline from './HeartRateMeterGlowInline';

const DataCard = React.memo(({ data }) => {
  if (!data) return null;

  const [
    truck_id,
    lat,
    long,
    speed,
    x,
    y,
    z,
    o2,
    pressure,
    la_less_than,
    duration,
    record,
    count,
    warning,
    name,
    description,
    hr,
    lap
  ] = data;

  // ตรวจสอบค่า hr และกำหนด props สำหรับ HeartRateMeterGlowInline
  const heartRateProps = hr === 0 ? {
    value: 0, // ส่งค่า 0
    maxHr: 200,
    zonePreset: "motorsport",
    unit: "BPM",
    accent: "#0000ff", // เปลี่ยนสีให้เหมือนกับ background
    height: 110,
    showGrid: true,
    showBar: true,
    stickBottom: true,
    // เพิ่ม props สำหรับกรณี hr = 0
    invisible: true, // flag สำหรับแจ้ง component ว่าให้ซ่อน
    backgroundColor: "#0000ff" // สีพื้นหลังเหมือนกับ card
  } : {
    value: hr,
    maxHr: 200,
    zonePreset: "motorsport",
    unit: "BPM",
    accent: "#c1fe00",
    height: 110,
    showGrid: true,
    showBar: true,
    stickBottom: true,
    invisible: false,
    backgroundColor: "#242424" // เปลี่ยนจาก "transparent" เป็น "#242424" (สีเดิม)
  };

  return (
    <CCard className='border-dark' style={{borderRadius: '0', backgroundColor: '#0000ff', zIndex: '-1'}}>
      <div className='card-truck-header' style={{ padding: '0rem 0.5rem 0rem 1rem', backgroundColor: 'black', color: '#c1fe00' }}>
        <strong>NUMBER #{name}</strong>
      </div>

      <CCardBody style={{ 
        padding: '3.5rem 1rem 1rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: '250px',
        position: 'relative'
      }}>
        {/* Main Data Row */}
        <CRow 
          className="mb-1" 
          xs={{ gutter: 3 }} 
          style={{ 
            height: '110px',
            display: 'flex',
            alignItems: 'flex-end',
            margin: 0,
            justifyContent: 'center'
          }}
        >
          {/* Heart Rate Meter */}
          <CCol xs={4} style={{ 
            height: '110px',
            padding: 0,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '200px',
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              // เพิ่มสไตล์สำหรับกรณี hr = 0
              backgroundColor: hr === 0 ? '#0000ff' : 'transparent',
              opacity: hr === 0 ? 0 : 1, // ซ่อนทั้งหมดเมื่อ hr = 0
              transition: 'opacity 0.3s ease' // smooth transition
            }}>
              <HeartRateMeterGlowInline {...heartRateProps} />
            </div>
          </CCol>

          {/* G-Force Meter */}
          <CCol xs={4} style={{ 
            height: '110px',
            padding: 0,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: '100%',
              maxWidth: '200px',
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end'
            }}>
              <GForceMeterHr gForceData={{x: x, y: y, max: 2}} />
            </div>
          </CCol>

          {/* Speed Gauge */}
          <CCol xs={4} style={{ 
            height: '110px',
            padding: 0,
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            <div style={{ 
              width: '100%',
              maxWidth: '200px',
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end'
            }}>
              <SpeedGaugeChartHrLive value={speed ? speed : 0} unit="KM/H" name="" />
            </div>
          </CCol>
        </CRow>
      </CCardBody>

      <div className='card-truck-footer' style={{ backgroundColor: 'black', color: '#c1fe00' }}>
        <p className="m-1 rounded" style={{border: '1px solid #628000', fontSize: '1rem', padding: '0.1rem 0.5rem 0.1rem 0.5rem'}}>
          PTRS SMOKE DETECTOR <span style={{ color: '#c1fe00' }}>ID: {truck_id}</span>
        </p>
        &nbsp;
        <p style={{ color: 'gray' }}>LAP: {lap}</p>
      </div>

      <style jsx="true">{`
        .number-square {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          font-weight: normal;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          line-height: 0.7;
        }

        .number-warning-square {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.7rem;
          font-weight: normal;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          line-height: 0.7;
        }

        .number-square-container {
          display: flex;
          flex-wrap: wrap;
        }

        .number-square-column {
          flex: 1 1 33%; /* Ensure each column takes up 1/3 of the container */
          display: flex;
          justify-content: center;
          font-size: 0.7rem;
        }
        
        .number-header {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: normal;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          line-height: 0.8;
        }
        
        .card-header {
          border-radius: 0;
        }

        .card-header:first-child {
          border-radius: 0;
        }

        .card-truck-header {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: normal;
          margin: 0;
          box-sizing: border-box;
          line-height: 0.8;
        }

        .card-truck-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: normal;
          margin: 0;
          box-sizing: border-box;
          line-height: 0.8;
        }

        /* Live Stream Optimizations */
        @media (min-width: 768px) {
          .card-truck-header {
            font-size: 2.8rem;
          }
        }

        /* สำหรับ Chroma Key / Green Screen */
        .live-stream-ready {
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </CCard>
  );
});

export default DataCard;