import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CRow,
  CCol,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CAlert,
  CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
  cilSettings,
  cilSave,
  cilReload,
  cilArrowThickToBottom,
  cilCheckCircle,
  cilSync,
  cilXCircle,
  cilCheck,
  cilCheckAlt,
  cilX
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'



const VerticallyCentered = () => {
  const [visible, setVisible] = useState(false);
  const [lalessthanInput, setLaLessThanInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  
  const [exportTruckName, setExportTruckName] = useState('');
  const [exportTruckInput, setExportTruckInput] = useState('');
  const [exportStartDateInput, setExportStartDateInput] = useState('');
  const [exportEndDateInput, setExportEndDateInput] = useState('');
  
  const [currentTruckNameInput, setCurrentTruckNameInput] = useState('');
  const [currentTruckNumInput, setCurrentTruckNumInput] = useState('');
  const [newTruckNumInput, setNewTruckNumInput] = useState('');

  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for the success message
  // const [errorVisible, setErrorVisible] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(''); // State for the error message
  const [selectTruckError, setSelectTruckError] = useState(''); // State for the error message
  const [fillLambdaError, setFillLambdaError] = useState(''); // State for the error message
  const [exportInputError, setExportInputError] = useState(''); // State for the error message

  const [changeTruckNumberError, setChangeTruckNumberError] = useState(''); // State for the error message
  const [checkedItems, setCheckedItems] = useState({});

  const [cars, setCars] = useState([]);
  // const [ipAPI, setIpAPI] = useState("http://elg-platform.duckdns.org:4000");
  const [ipAPI, setIpAPI] = useState("");

  // เพิ่ม state สำหรับ Loading Modal
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');


  // Handle checkbox change
  const handleCheckboxChange = (carNumber) => {
    setCheckedItems((prev) => ({
      ...prev,
      [carNumber]: !prev[carNumber],
    }));
  };

  const handleSelectAll = () => {
    const allChecked = Object.values(checkedItems).every((value) => value);
  
    const updatedChecked = {};
    cars.forEach((car) => {
      updatedChecked[car.car] = !allChecked;
    });
  
    setCheckedItems(updatedChecked);
  };


  const handleGetAllCar = async () => {
    // แสดง Loading Modal
    setLoadingMessage("Loading truck data...");
    setLoadingVisible(true);

    try {
      const response = await fetch(`${ipAPI}/GetAllCar`, {
        method: "POST",
        headers: {
          Authorization: "Basic czYzOjU3YjQ2OGQ4MTFmOA==",
        },
      });

      const result = await response.json();
      setCars(result);
      setCheckedItems(result.map(() => false));
      
      // ซ่อน Loading Modal
      setLoadingVisible(false);
    } catch (error) {
      console.error("Error fetching cars:", error);
      
      // ซ่อน Loading Modal
      setLoadingVisible(false);
      
      // แสดง Error Message
      setSuccessMessage("Failed to load truck data. Please try again.");
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 5000);
    }
  };

  const handleSaveConfig = () => {
    const selectedData = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([car]) => Number(car));

    if (selectedData.length === 0) {
      setSelectTruckError("Please select truck");
      return;
    } else {
      setSelectTruckError("");
    }

    if (lalessthanInput == '' || durationInput == '') {
      setFillLambdaError('Please fill lambda less than and lambda duration'); 
      return; 
    } else {
      setFillLambdaError(""); 
    }

    // แสดง Loading Modal
    setLoadingMessage("Saving lambda configuration...");
    setLoadingVisible(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic czYzOjU3YjQ2OGQ4MTFmOA==");

    const raw = JSON.stringify({
      "truck": selectedData,
      "la_less_than": parseInt(lalessthanInput, 10),
      "duration": parseInt(durationInput, 10)
    });

    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${ipAPI}/UpdateConfig`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((result) => {
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        setSuccessMessage("Save config successfully!")
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 5000);
      })
      .catch((error) => {
        console.error(error);
        
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        // แสดง Error Message
        setSuccessMessage("Failed to save config. Please try again.");
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 5000);
      });
  };

  const handleCalibateGForce = () => {
    const selectedData = Object.entries(checkedItems)
    .filter(([_, isChecked]) => isChecked)
    .map(([car]) => Number(car));

    if (selectedData.length === 0) {
      setSelectTruckError("Please select truck");
      return;
    } else {
      setSelectTruckError("");
    }

    // แสดง Loading Modal
    setLoadingMessage("Calibrating G-Force sensors...");
    setLoadingVisible(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic czYzOjU3YjQ2OGQ4MTFmOA==");

    const raw = JSON.stringify({
      "truck": selectedData
    });

    console.log(raw);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${ipAPI}/CalibateGforce`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((result) => {
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        setSuccessMessage(`Calibate G-Force successfully!`)
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 5000);
      })
      .catch((error) => {
        console.error(error);
        
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        // แสดง Error Message
        setSuccessMessage("Failed to calibrate G-Force. Please try again.");
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 5000);
      });
  };

  const handleResetLambdaCount = () => {
    const selectedData = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([car]) => Number(car));
    
    if (selectedData.length === 0) {
      setSelectTruckError('Please select truck');
      return;
    } else {
      setSelectTruckError("");
    }

    // แสดง Loading Modal
    setLoadingMessage("Resetting lambda count...");
    setLoadingVisible(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic czYzOjU3YjQ2OGQ4MTFmOA==");

    const raw = JSON.stringify({
      "truck": selectedData
    });

    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${ipAPI}/ResetLambdaCount`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((result) => {
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        setSuccessMessage(`Reset lambda count successfully!`)
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 5000);
      })
      .catch((error) => {
        console.error(error);
        
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        // แสดง Error Message
        setSuccessMessage("Failed to reset lambda count. Please try again.");
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 5000);
      });
  };
  
  const handleExportVariable = (carID) => {
    setExportTruckInput(carID);
  
    const selectedCar = cars.find((car) => String(car.car) === carID);
    const label = selectedCar?.name || '';
  
    setExportTruckName(label);
  };

  const handleExport = () => {
    if (exportTruckInput == '') {
      setExportInputError("Please fill truck number");
      return;
    } 
    else if (exportStartDateInput == '' || exportEndDateInput == '') {
      setExportInputError("Please fill start time and end time");
      return;
    } 
    else {
      setExportInputError("");
    }

    // แสดง Loading Modal
    setLoadingMessage("Exporting data, please wait...");
    setLoadingVisible(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Basic czYzOjU3YjQ2OGQ4MTFmOA==");

    const urlencoded = new URLSearchParams();
    urlencoded.append("car", parseInt(exportTruckInput, 10));
    urlencoded.append("start_datetime", exportStartDateInput);
    urlencoded.append("end_datetime", exportEndDateInput);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    fetch(`${ipAPI}/Reports`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((result) => {
        // ซ่อน Loading Modal
        setLoadingVisible(false);

        // Create a Blob from the CSV data
        const blob = new Blob([result], { type: 'text/csv' });

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${exportStartDateInput}_${exportEndDateInput}-truck${exportTruckName}-data.csv`;

        // Append the link to the document
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);

        // แสดง Success Message
        setSuccessMessage("Export completed successfully!");
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 3000);
      })
      .catch((error) => {
        console.error('Error downloading the CSV file:', error);
        
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        // แสดง Error Message
        setSuccessMessage("Export failed. Please try again.");
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 5000);
      });
  };

  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;

    // ปิด datetime picker ด้วยการ blur
    e.target.blur();
  
    if (!exportStartDateInput) {
      setExportInputError("Please select start time first.");
      return;
    }
  
    if (selectedEndTime < exportStartDateInput) {
      setExportInputError("End time cannot be earlier than start time.");
      return;
    }
  
    setExportEndDateInput(selectedEndTime);
    setExportInputError(""); // Clear error
  };

  const handleSetCarVariable = (carID) => {
    setCurrentTruckNumInput(carID);
  
    const selectedCar = cars.find((car) => String(car.car) === carID);
    const label = selectedCar?.name || '';
  
    // หรือเก็บไว้ใน state ก็ได้
    setCurrentTruckNameInput(label);
  };

  const handleSetCarDetail = () => {
    if (newTruckNumInput == '' || currentTruckNumInput == '') {
      setChangeTruckNumberError('Please fill truck id and new truck number');
      return;
    } else {
      setChangeTruckNumberError('');
    }
    
    // แสดง Loading Modal
    setLoadingMessage("Changing truck number...");
    setLoadingVisible(true);
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic czYzOjU3YjQ2OGQ4MTFmOA==");

    const raw = JSON.stringify({
      "car": parseInt(currentTruckNumInput, 10),
      "name": newTruckNumInput,
      "description": "",
      "cmd" : 1
    });

    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${ipAPI}/SetDetail`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((result) => {
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        setSuccessMessage(`Change truck number "${currentTruckNameInput}" to "${newTruckNumInput}" successfully!`)
        setSuccessVisible(true);
        setTimeout(() => {
          setSuccessVisible(false);
          window.location.reload();
        }, 5000);
      })
      .catch((error) => {
        console.error(error);
        
        // ซ่อน Loading Modal
        setLoadingVisible(false);
        
        // แสดง Error Message
        setSuccessMessage("Failed to change truck number. Please try again.");
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 5000);
      });
  };


  function SuccessModal({ successVisible, setSuccessVisible, message }) {
    return (
      <CModal alignment="center" visible={successVisible} onClose={() => setSuccessVisible(false)}>
        <CModalBody className='text-center'>
          <div>
            <CIcon icon={cilCheckCircle} size="7xl" style={{ color: '#C1FE00' }} />
          </div>
          <div>
            <h2><strong>{message}</strong></h2>
          </div>
          <div className='pt-3'>
            <CButton onClick={() => setSuccessVisible(false)} style={{ width: '20%', backgroundColor: '#C1FE00', color: 'black' }}>
              OK
            </CButton>
          </div>
        </CModalBody>
      </CModal>
    );
  }

  function LoadingModal({ loadingVisible, setLoadingVisible, message }) {
    return (
      <CModal 
        alignment="center" 
        visible={loadingVisible} 
        backdrop="static" 
        keyboard={false}
        onClose={() => {}} // ป้องกันการปิด modal ระหว่าง loading
      >
        <CModalBody className='text-center py-5'>
          <div className="mb-4">
            {/* Spinning Icon */}
            <div 
              style={{
                width: '60px',
                height: '60px',
                border: '6px solid #f3f3f3',
                borderTop: '6px solid #C1FE00',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}
            ></div>
          </div>
          <div>
            <h3><strong>{message}</strong></h3>
          </div>
          <div className="mt-3">
            <p style={{ color: '#666', fontSize: '14px' }}>
              Please do not close this window
            </p>
          </div>
        </CModalBody>
        
        {/* เพิ่ม CSS Animation */}
        <style jsx="true">{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </CModal>
    );
  }

  // useEffect(() => {
  //   handleGetAllCar();
  // }, []);

  useEffect(() => {
    if (visible) {
      handleGetAllCar(); // เรียก API เมื่อ modal เปิด
    }
  }, [visible]);
  

  useEffect(() => {
    if (cars.length > 0) {
      const initialChecked = {};
      cars.forEach((car) => {
        initialChecked[car.car] = false; // หรือ true ถ้าต้องการติ๊กไว้ก่อน
      });
      setCheckedItems(initialChecked);
    }
  }, [cars]);

  return (
    <>
      <CIcon
        icon={cilSettings} 
        size="lg" 
        onClick={() => setVisible(!visible)} 
        style={{
          color: "#000000", 
          opacity: 0.65,
          transition: 'opacity 0.3s', 
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.65}
        title='Settings'
      />

      <CModal size="xl" scrollable alignment="center" visible={visible} 
        onClose={() => {
          setVisible(false);
          setCars([]); // reset cars array
          setCheckedItems([]); // reset checkbox selections
          setSelectTruckError("");
          setFillLambdaError("");
          setExportInputError("");
          setChangeTruckNumberError(""); // เพิ่มการ reset error นี้ด้วย
        }}
      >
        <CModalHeader className='py-1'style={{backgroundColor: '#C1FE00'}} >
          <CModalTitle className='modal-title-text' style={{ fontSize:"1.5rem" }}>
            <CIcon icon={cilSettings} size="lg" />&nbsp;&nbsp;<strong>Settings</strong>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className='card-font-size' style={{backgroundColor: '#212631'}}>

          {/* <CTabs activeItemKey={2}>
            <CTabList variant="underline-border">
              <CTab aria-controls="home-tab-pane" itemKey={1}>
                Lambda
              </CTab>
              <CTab aria-controls="profile-tab-pane" itemKey={2}>
                G-Force
              </CTab>
              <CTab aria-controls="contact-tab-pane" itemKey={3}>
                Export
              </CTab>
            </CTabList>
            <CTabContent>
              <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                
              </CTabPanel>
              <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                Profile tab content
              </CTabPanel>
              <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                Contact tab content
              </CTabPanel>
            </CTabContent>
          </CTabs> */}

          {/* ========================== Lambda Config ========================== */}

          <h3 className='px-3' style={{color: 'white', backgroundColor: "#333b4d", borderLeft: '6px solid #C1FE00'}}><strong>Lambda Config</strong></h3>

          <div className='' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <CFormLabel className='color-label-green px-3'>Select Truck</CFormLabel>

            {/* <CButton color="secondary" onClick={handleSelectAll} className='mx-1'>
              <CIcon icon={checkedItems.every((item) => item) ? cilX : cilCheckAlt} size="sm" />&nbsp;&nbsp;
              {checkedItems.every((item) => item) ? 'Deselect All' : 'Select All'}
            </CButton> */}

            <CButton color="secondary" onClick={handleSelectAll} className='mx-1'>
              <CIcon
                icon={
                  Object.values(checkedItems).every((item) => item)
                    ? cilX
                    : cilCheckAlt
                }
                size="sm"
              />
              &nbsp;&nbsp;
              {Object.values(checkedItems).every((item) => item)
                ? "Deselect All"
                : "Select All"}
            </CButton>

          </div>

          <CRow className="mb-3 mx-3" xs={{ gutter: 2 }}>
            {cars.map((carItem, index) => (
              <CCol className="col-auto text-light" key={carItem._id}>
                <CFormCheck
                  id={`truckchk-${carItem.car}`}
                  label={`${carItem.name}`}
                  checked={checkedItems[carItem.car]}
                  onChange={() => handleCheckboxChange(carItem.car)}
                />
              </CCol>
            ))}

            {/* Check input empty */}
            {selectTruckError && <p className='text-center' style={{ color: 'red' }}>{selectTruckError}</p>}
            
          </CRow>

          <CRow className="mb-3 mx-1" xs={{ gutter: 4 }}>
            <CCol className="col-lg-3">
              <CFormLabel className='color-label-green' htmlFor="lalessthanInput">Lambda less than</CFormLabel>
              <CFormInput
                type="number"
                id="lalessthanInput"
                placeholder="number only"
                min="1"
                value={lalessthanInput}
                onChange={(e) => setLaLessThanInput(e.target.value)}
              />
            </CCol>
            <CCol className="col-lg-3">
              <CFormLabel className='color-label-green' htmlFor="durationInput">Lambda Duration (seconds)</CFormLabel>
              <CFormInput
                type="number"
                id="durationInput"
                placeholder="number only"
                min="1"
                max="10"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
              />
            </CCol>
            {/* Check input empty */}
            {fillLambdaError && <p className='text-center' style={{ color: 'red' }}>{fillLambdaError}</p>}
          </CRow>

          <div className="d-flex align-items-center justify-content-end mx-2">
            <CButton className='mx-1' color="primary py-0" style={{ fontSize: "1.5rem", backgroundColor: '#C1FE00', color: "black" }} onClick={handleCalibateGForce}>
              <CIcon icon={cilSync} size="sm" />&nbsp;&nbsp;Calibate G-Force
            </CButton>
            <CButton className='mx-1' color="primary py-0" style={{ fontSize: "1.5rem", backgroundColor: '#C1FE00', color: "black" }} onClick={handleResetLambdaCount}>
              <CIcon icon={cilReload} size="sm" />&nbsp;&nbsp;Reset Lambda Count
            </CButton>
            <CButton className='mx-1' color="primary py-0" style={{ fontSize: "1.5rem", backgroundColor: '#C1FE00', color: "black" }} onClick={handleSaveConfig}>
              <CIcon icon={cilSave} size="sm" />&nbsp;&nbsp;Save Lambda Config
            </CButton>
          </div>
          
          {/* Change Truck Number */}
          <h3 className='px-3 mt-4' style={{color: 'white', backgroundColor: "#333b4d", borderLeft: '6px solid #C1FE00'}}><strong>Change Truck Number</strong></h3>

          <CRow className="mb-3 mx-1" xs={{ gutter: 4 }}>
            <CCol className="col-lg-3">
              <CFormLabel className='color-label-green' htmlFor="brandInput">Truck Number</CFormLabel>

              <CFormSelect 
                aria-label="Default select example"
                value={currentTruckNumInput}
                onChange={(e) => handleSetCarVariable(e.target.value)}
                options={[
                  { label: 'Select Truck Number', value: '' },
                  ...cars.map((item) => ({
                    label: item.name,
                    value: String(item.car)
                  }))
                ]}
              />

            </CCol>

            <CCol className="col-lg-3">
              <CFormLabel className='color-label-green' htmlFor="newTruckNumInput">New Truck Number</CFormLabel>
              <CFormInput
                type="text"
                id="newTruckNumInput"
                placeholder="ex. A301"
                value={newTruckNumInput}
                onChange={(e) => setNewTruckNumInput(e.target.value)}
              />
            </CCol>

            {changeTruckNumberError && <p className='text-center' style={{ color: 'red' }}>{changeTruckNumberError}</p>}
          </CRow>

          <div className="d-flex align-items-center justify-content-end mx-2">
            <CButton className='mx-1' color="primary py-0" style={{ fontSize: "1.5rem", backgroundColor: '#C1FE00', color: "black" }} onClick={handleSetCarDetail}>
              <CIcon icon={cilSave} size="sm" />&nbsp;&nbsp;Change Truck Number
            </CButton>
          </div>


          {/* ========================== G-Force Meter ========================== */}

          {/* <h3 className='px-3 mt-4' style={{color: 'white', backgroundColor: "#333b4d", borderLeft: '6px solid #C1FE00'}}><strong>Calibate G-Force Meter</strong></h3>

          <div className="d-flex align-items-center justify-content-end mx-2">
            <CButton className='mx-1' color="primary py-0" style={{ fontSize: "1.5rem", backgroundColor: '#C1FE00', color: "black" }}>
              <CIcon icon={cilReload} size="sm" />&nbsp;&nbsp;Calibate
            </CButton>
          </div> */}
          
          {/* ========================== Export Data ========================== */}

          <h3 className='px-3 mt-4' style={{color: 'white', backgroundColor: "#333b4d", borderLeft: '6px solid #C1FE00'}}><strong>Export Data</strong></h3> 
          
          <CRow className="mb-3 mx-1" xs={{ gutter: 4 }}>
            <CCol className="col-lg-3">
              <CFormLabel className='color-label-green' htmlFor="exportTruckInput">Truck Number</CFormLabel>
              <CFormSelect 
                aria-label="Default select example"
                value={exportTruckInput}
                onChange={(e) => handleExportVariable(e.target.value)}
                options={[
                  { label: 'Select Truck Number', value: '' },
                  ...cars.map((item) => ({
                    label: item.name,
                    value: String(item.car)
                  }))
                ]}
              />
            </CCol>
            
            <CCol className="col-lg-3">
              <CFormLabel className='color-label-green' htmlFor="exportStartDateInput">Start Time</CFormLabel>
              <CFormInput
                type="datetime-local"
                id="exportStartDateInput"
                placeholder="Select start time"
                value={exportStartDateInput}
                onChange={(e) => setExportStartDateInput(e.target.value)}
              />
            </CCol>

            <CCol className="col-lg-3">
              <CFormLabel className='color-label-green' htmlFor="exportEndDateInput">End Time</CFormLabel>
              <CFormInput
                type="datetime-local"
                id="exportEndDateInput"
                placeholder="Select end time"
                value={exportEndDateInput}
                onChange={handleEndTimeChange}
                disabled={!exportStartDateInput} // 🔒 ปิดถ้ายังไม่ได้เลือก Start
                min={exportStartDateInput} // ⛔ ไม่ให้เลือกเวลาก่อน Start
              />

            </CCol>

          </CRow>

          {/* Check input empty */}
          {exportInputError && <p className='text-center' style={{ color: 'red' }}>{exportInputError}</p>}

          <div className="d-flex align-items-center justify-content-end mx-2">
            <CButton className='mx-1' color="secondary py-0" style={{ fontSize: "1.5rem" }} onClick={handleExport}>
              <CIcon icon={cilArrowThickToBottom} size="sm" />&nbsp;&nbsp;Export
            </CButton>
          </div>

          {/* <CRow className="mx-3 pt-2" xs={{ gutter: 0 }}>
            <CCol className="col-1">
              <CFormLabel className='color-label-green' htmlFor="exportStartDateInput">Date</CFormLabel>
            </CCol>
            <CCol className="col-4">
              <CFormInput
                type="date"
                id="exportStartDateInput"
                placeholder="date"
              />
            </CCol>
            <CCol className="col-4">
              <CButton className='mx-3' color="secondary py-0" style={{ fontSize: "1.5rem" }}>
              <CIcon icon={cilArrowThickToBottom} size="sm" />&nbsp;&nbsp;Export
              </CButton>
            </CCol>
          </CRow> */}

        </CModalBody>

        <CModalFooter className='py-1' style={{backgroundColor: '#1a1a1a', borderColor: '#1a1a1a'}}>
          <div className="d-flex align-items-center justify-content-center">
            <CButton className='mx-1' color="outline-secondary py-0" style={{ fontSize: "1.5rem" }} onClick={() => setVisible(false)}>
              Close
            </CButton>
            {/* <CButton className='mx-1' color="primary py-0" style={{ fontSize: "1.5rem", backgroundColor: '#C1FE00', color: "black" }}>
              <CIcon icon={cilSave} size="sm" />&nbsp;&nbsp;Save
            </CButton> */}
          </div>
        </CModalFooter>

        {/* Success Popup */}
        <SuccessModal 
          successVisible={successVisible} 
          setSuccessVisible={setSuccessVisible} 
          message={successMessage} // Pass the success message to the modal
        />

        {/* Loading Popup */}
        <LoadingModal 
          loadingVisible={loadingVisible} 
          setLoadingVisible={setLoadingVisible} 
          message={loadingMessage}
        />

        <style jsx="true">{`
        .form-control {
          font-size:1.4rem;
          padding-top: 0;
          padding-bottom: 0;
        }

        .color-label-green {
          color:#B9FF00; 
        }
        
        .nav-link {
          color: white;
        }

        .nav-underline-border .nav-link.active, .nav-underline-border .show > .nav-link {
          color: #C1FE00;
        }

        .nav-link:hover, .nav-link:focus { 
          color: #9ccc00;
        }

        .form-check-input:checked { 
          background-color: #9ccc00;
          border-color: #9ccc00;
        }
        `}</style>
      </CModal>
    </>
  )
}

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-3 p-0" ref={headerRef} style={{backgroundColor: "#C1FE00"}}>
      <CContainer className="px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
 
        <CHeaderNav>
          {/* <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li> */}
          {/* <AppHeaderDropdown /> */}
          {VerticallyCentered()}
        </CHeaderNav>
      </CContainer>
      
      {/* <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer> */}

      <style jsx="true">{`
        .header > .container-fluid {
          min-height: calc(1rem + 1px);
        }
      `}</style>
    </CHeader>
  )
}

export default AppHeader
