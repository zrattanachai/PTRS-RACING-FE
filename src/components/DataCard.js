import React, { useEffect, useState } from 'react';
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
  CTooltip
} from '@coreui/react'
import RingGaugeChart from './RingGaugeChart';
import SpeedGaugeChart from './SpeedGaugeChart';

// const DataCard = React.memo(({ data, record, count, warning }) => {
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

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Update the animation key to trigger the animation whenever warning changes
    setAnimationKey(prevKey => prevKey + 1);
  }, [warning]);

  return (
    <CCard className='border-dark' style={{borderRadius: '0'}}>
      {/* <CCardHeader style={{paddingTop: '0', paddingBottom: '0', backgroundColor: 'black', color: '#c1fe00' }}>
        <strong>NUMBER #{truck_id}</strong>
      </CCardHeader> */}

      {/* <div className='number-square' style={{ fontSize: '3rem', padding: '0rem 0.5rem 0rem 1rem', backgroundColor: 'black', color: '#c1fe00' }}> */}
      <div className='card-truck-header' style={{ padding: '0rem 0.5rem 0rem 1rem', backgroundColor: 'black', color: '#c1fe00' }}>
        <strong>NUMBER #{name}</strong>
      </div>

      <CCardBody>
        <CRow className="mb-2" xs={{ gutter: 2 }}>
          <CCol className="col text-center">
            <p style={{fontSize: '1.1rem', fontWeight: 'bold', margin: 0, paddingTop:0 }}>LAMBDA</p>
            <RingGaugeChart value={o2 ? o2 : 0} unit="λ" name="LAMBDA" />
            <p style={{fontSize: '1.1rem', fontWeight: 'bold', margin: 0, paddingTop:0 }}>SPEED</p>
            
            <SpeedGaugeChart value={speed ? speed : 0} unit="KM/H" name="SPEED" unitsize="0.7" namesize="0.8" />
          </CCol>
          <CCol className="col">
            <CRow className="mb-3" xs={{ gutter: 0 }}>
              {/* Count */}
              <div className='text-center' style={{
                width: '70%',
                margin: 'auto', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}>
                {/* <p style={{ backgroundColor: '#c1fe00', color: 'black' }}>COUNT</p>
                <p style={{ backgroundColor: '#000000', color: 'white', fontSize: '3rem', margin: 0, paddingTop: 0 }}><b>{count}</b></p> */}
                
                {/* remove padding */}
                <p className='number-header' style={{ backgroundColor: '#c1fe00', color: 'black' }}>COUNT</p>
                <p className="number-square" style={{ backgroundColor: '#000000', color: 'white' }}>{count}</p>

                {/* <CTooltip
                  content={`Lambda < ${la_less_than} , Duration ${duration}s`}
                  placement="right"
                >
                  <div className="number-square-container">
                    <div className="number-square-column" style={{ backgroundColor: record >= 1 ? 'red' : '#d9d9d9' }}>
                      1 SEC
                    </div>
                    <div className="number-square-column" style={{ backgroundColor: record >= 2 ? 'red' : '#d9d9d9' }}>
                      1 SEC
                    </div>
                    <div className="number-square-column" style={{ backgroundColor: record >= 3 ? 'red' : '#d9d9d9' }}>
                      1 SEC
                    </div>
                  </div>
                </CTooltip> */}

                <CTooltip
                  content={`Lambda < ${la_less_than} , Duration ${duration}s`}
                  placement="right"
                >
                  <div className="number-square-container">
                    {duration >= 1 && (
                      <div className="number-square-column" style={{ backgroundColor: record >= 1 ? 'red' : '#d9d9d9' }}>
                        1 SEC
                      </div>
                    )}
                    
                    {duration >= 2 && (
                      <div className="number-square-column" style={{ backgroundColor: record >= 2 ? 'red' : '#d9d9d9' }}>
                        1 SEC
                      </div>
                    )}
                    
                    {duration >= 3 && (
                      <div className="number-square-column" style={{ backgroundColor: record >= 3 ? 'red' : '#d9d9d9' }}>
                        1 SEC
                      </div>
                    )}
                  </div>
                </CTooltip>

              </div>
            </CRow>
            
            <CRow className="mb-3" xs={{ gutter: 0 }}>
              {/* Warning */}
              <div className='text-center' key={animationKey} style={{
                width: '72%',
                margin: 'auto',
                // backgroundColor: warning >= 3 ? 'red' : '#d9d9d9',
                // color: 'white',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                animation: warning == 3 ? 'blink-animation 0.4s 3' : 'none'
              }}>
                {/* <p className='number-header'>WARNING</p>
                <p className="number-warning-square">{warning}</p> */}

                <p className='number-header' style={{ 
                  backgroundColor: warning >= 3 ? 'red' : '#c1fe00', 
                  color: warning >= 3 ? 'white' : 'black' 
                }}>
                  WARNING
                </p>
                <p className="number-warning-square" style={{ 
                  backgroundColor: warning >= 3 ? 'red' : '#000000', 
                  color: 'white'
                }}>
                  {warning}
                </p>
              </div>
            </CRow>
            
            <CRow xs={{ gutter: 0 }}>
              {/* PENALTY */}
              <div className='text-center'>
                <div key={animationKey} style={{
                  backgroundColor: warning >= 4 ? 'red' : '#d9d9d9',
                  // padding: '10px',
                  padding: "20px 10px 20px 10px",
                  // borderRadius: '5px',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  animation: warning >= 4 ? 'blink-animation 0.4s 5' : 'none'
                }}>
                  PENALTY
                </div>
              </div>
            </CRow>
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
        <p className="m-1 rounded" style={{border: '1px solid #628000', fontSize: '1rem', padding: '0.1rem 0.5rem 0.1rem 0.5rem'}}>
          PTRS SMOKE DETECTOR <span style={{ color: '#c1fe00' }}>ID: {truck_id}</span>
        </p>
        &nbsp;
        <p style={{ color: 'gray' }}>LAP: {lap}</p>
      </div>

      <style jsx="true">{`
        @keyframes blink-animation {
          0% {opacity: 1;}
          50% {opacity: 0.2;}
          100% {opacity: 1;}
        }

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
