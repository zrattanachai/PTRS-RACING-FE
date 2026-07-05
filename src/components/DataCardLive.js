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
import RingGaugeChart from './RingGaugeChart';
import SpeedGaugeChartLive from './SpeedGaugeChartLive';
import GForceMeter from './GForceMeter';

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
    description
  ] = data;

  return (
    <CCard className='border-dark' style={{borderRadius: '0', backgroundColor: '#0000ff', zIndex: '-1'}}>
      <div className='card-truck-header' style={{ padding: '0rem 0.5rem 0rem 1rem', backgroundColor: 'black', color: '#c1fe00' }}>
        <strong>NUMBER #{name}</strong>
      </div>

      <CCardBody>
        <CRow className="mb-2" xs={{ gutter: 2 }}>
          <CCol className="col text-center">
              <GForceMeter gForceData={{x: x, y: y, max: 2}} />
          </CCol>
          <CCol className="col">
            <SpeedGaugeChartLive value={speed ? speed : 0} unit="KM/H" name="SPEED" />
          </CCol>
        </CRow>

        {/* <p>Latitude: {lat}</p>
        <p>Longitude: {long}</p>
        <p>Speed: {speed}</p>
        <p>X: {x}</p>
        <p>Y: {y}</p>
        <p>Z: {z}</p>
        <p>O2: {o2}</p>
        <p>Pressure: {pressure}</p> */}

      </CCardBody>

      <div className='card-truck-footer' style={{ backgroundColor: 'black', color: '#c1fe00' }}>
        <p className="m-1 rounded" style={{border: '1px solid #628000', fontSize: '1rem', padding: '0.1rem 0.5rem 0.1rem 0.5rem'}}>PTRS SMOKE DETECTOR</p>
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
      `}</style>
    </CCard>
  );
});

export default DataCard;
