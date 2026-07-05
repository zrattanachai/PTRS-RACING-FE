import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

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
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import { manageWebSocketConnections } from '../../websocketService';
import DataCard from '../../components/DataCardHrLive';

const ALPHA = 1; 
let smoothSpeed = {}; 

const Dashboard = () => {
  const [data, setData] = useState({});
  const [counts, setCounts] = useState({});
  const [error, setError] = useState(null);
  //const [ipSocket, setIpSocket] = useState("ws://localhost:4000");
  const [ipSocket, setIpSocket] = useState("ws://34.143.131.92:4000");
  
  const urls = [
    ipSocket + '/car25',
    ipSocket + '/car26',
    ipSocket + '/car27',
    ipSocket + '/car28',
    ipSocket + '/car29',
    ipSocket + '/car30',
    ipSocket + '/car31',
    ipSocket + '/car32',
  ];

  useEffect(() => {
    const handleMessage = (url, message) => {
      let parsedData = JSON.parse(message.data);

      // parsedData[3] = Math.round(parsedData[3]);

      //////////////////////////////////////////////////////////////////////

      let rawSpeed = (Math.round(parsedData[3]) + 0.1) + Math.random() * 0.8;

      if (!smoothSpeed[url]) {
        smoothSpeed[url] = rawSpeed;
      }

      smoothSpeed[url] = ALPHA * rawSpeed + (1 - ALPHA) * smoothSpeed[url];
      parsedData[3] = Math.round(smoothSpeed[url]);

      setData((prevData) => ({
        ...prevData,
        [url]: parsedData,
      }));

      console.log(parsedData);
    };

    const handleError = (error) => {
      setError(error);
    };

    const closeConnections = manageWebSocketConnections(urls, handleMessage, handleError);

    return () => {
      closeConnections();
    };
  }, []);

  return (
    <>
      <CRow className="mb-2" xs={{ gutter: 3 }}>
        {urls.map((url) => (
          <CCol className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" key={url}>
            <DataCard 
              data={data[url]}
            />
          </CCol>
        ))}

        {/* <CCol className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" key={1}>
          <DataCard 
            data={[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "1", "Truck 1", 80]}
          />
        </CCol>
        <CCol className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" key={2}>
          <DataCard 
            data={[41, 14.9643221, 103.0851288, 90, -0.928, -0.064, 2.356, 0, 11.2, 1, 3, 2, 0, 410, '41', '', 130]}
          />
        </CCol>
        <CCol className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" key={2}>
          <DataCard 
            data={[2, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, "2", "Truck 3", 150]}
          />
        </CCol>
        <CCol className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" key={2}>
          <DataCard 
            data={[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "2", "Truck 3", 170]}
          />
        </CCol>
        <CCol className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" key={2}>
          <DataCard 
            data={[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "2", "Truck 3", 190]}
          />
        </CCol> */}
      </CRow>
    </>
  )
}

export default Dashboard
