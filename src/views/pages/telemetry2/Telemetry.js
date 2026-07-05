import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow, 
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilMediaPlay, cilMediaPause, cilReload, cilMediaStop, cilZoomIn, cilZoomOut } from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faChevronLeft, faChevronRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import SpeedGaugeChart from '../../../components/SpeedGaugeChartTelemetry';
import GForceMeter from '../../../components/GForceMeterTelemetry';

// เพิ่ม Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

////////////////////////////////////////////////////
// Demo 1
////////////////////////////////////////////////////

const Telemetry = () => {
  const [svgRaw, setSvgRaw] = useState(null)
  const pathRef = useRef(null)
  const [carRefs, setCarRefs] = useState([])
  const [pathLength, setPathLength] = useState(0)
  const [progresses, setProgresses] = useState([])
  const animationRef = useRef(null)
  const meterPerPixelRef = useRef(0)

  const [isRunning, setIsRunning] = useState(false)
  const [telemetryData, setTelemetryData] = useState([])
  const lastTimeRef = useRef(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  const [widgetPosition, setWidgetPosition] = useState({ x: 50, y: 500 })
  const [dragging, setDragging] = useState(false)
  const offsetRef = useRef({ x: 0, y: 0 })

  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 })
  const isPanningRef = useRef(false)
  const panStartRef = useRef({ x: 0, y: 0 })

  // select car
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [carData, setCarData] = useState({});

  const carFiles = [
    '/data/telemetry/20240609_trackday_chang/car1.json',
    // '/data/telemetry/20240609_trackday_chang/car2.json',
    // '/data/telemetry/20240609_trackday_chang/carAAA.json',
  ]
  const startingPoint = 2087
  const trackRealDistance = 4554 // in meters

  // เพิ่ม state สำหรับจัดการแท็บ
  const [activeTab, setActiveTab] = useState(1); // เริ่มต้นที่แท็บที่ 1

  // เพิ่ม state สำหรับเก็บข้อมูลกราฟ
  const [chartData, setChartData] = useState({
    speed: [],
    gForce: [],
    timestamps: []
  });
  const [maxDataPoints] = useState(50); // จำกัดจำนวนจุดข้อมูลในกราฟ

    // เปลี่ยน state สำหรับเก็บข้อมูลกราฟ
  const [fullChartData, setFullChartData] = useState({
    speed: [],
    gForce: [],
    timestamps: []
  });
  const [currentDataIndex, setCurrentDataIndex] = useState(0); // ตำแหน่งปัจจุบันในข้อมูล

  // เพิ่ม state สำหรับเก็บ indexes
  const [dataIndexes, setDataIndexes] = useState([]);

  useEffect(() => {
    fetch('/imgs/telemetry/MapSongkhla_all_element_SVG.svg')
      .then((res) => res.text())
      .then(setSvgRaw)
  }, [])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const responses = await Promise.all(carFiles.map((url) => fetch(url)))
  //       const data = await Promise.all(responses.map((res) => res.json()))
        
  //       // กรอง data ให้เก็บเฉพาะทุก ๆ 7 records (ลด 7Hz เหลือ 1Hz)
  //       const filteredData = data.map(carData => {
  //         return carData.filter((record, index) => index % 7 === 0)
  //       })
        
  //       setTelemetryData(filteredData)
  //       setProgresses(Array(filteredData.length).fill(startingPoint))
  //       setCarRefs(filteredData.map(() => React.createRef()))
  //     } catch (err) {
  //       console.error('Error loading telemetry data:', err)
  //     }
  //   }

  //   fetchData()
  // }, [])

  // แก้ไข useEffect สำหรับโหลดข้อมูลครั้งแรก
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(carFiles.map((url) => fetch(url)))
        const data = await Promise.all(responses.map((res) => res.json()))
        
        // กรอง data ให้เก็บเฉพาะทุก ๆ 7 records (ลด 7Hz เหลือ 1Hz)
        const filteredData = data.map(carData => {
          return carData.filter((record, index) => index % 7 === 0)
        })
        
        setTelemetryData(filteredData)
        setProgresses(Array(filteredData.length).fill(startingPoint))
        setCarRefs(filteredData.map(() => React.createRef()))
        
        // เริ่มต้น indexes สำหรับทุกรถ
        setDataIndexes(Array(filteredData.length).fill(0))

        // สร้างข้อมูลกราฟทั้งหมดจากรถคันที่ถูกเลือก
        if (filteredData.length > 0 && filteredData[activeIndex]) {
          const carData = filteredData[activeIndex];
          const fullSpeedData = carData.map(item => item.speed || 0);
          const fullGForceData = carData.map(item => Math.sqrt((item.x || 0) * (item.x || 0) + (item.y || 0) * (item.y || 0)));
          const fullTimestamps = carData.map((_, index) => {
            // สร้าง timestamp จำลอง (1 วินาทีต่อข้อมูล)
            const seconds = index;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
          });

          setFullChartData({
            speed: fullSpeedData,
            gForce: fullGForceData,
            timestamps: fullTimestamps
          });
        }
      } catch (err) {
        console.error('Error loading telemetry data:', err)
      }
    }

    fetchData()
  }, [])

  // แก้ไข useEffect สำหรับการอัปเดตเมื่อเปลี่ยนรถ
  useEffect(() => {
    if (telemetryData.length > 0 && telemetryData[activeIndex]) {
      const carData = telemetryData[activeIndex];
      const fullSpeedData = carData.map(item => item.speed || 0);
      const fullGForceData = carData.map(item => Math.sqrt((item.x || 0) * (item.x || 0) + (item.y || 0) * (item.y || 0)));
      const fullTimestamps = carData.map((_, index) => {
        const seconds = index;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      });

      setFullChartData({
        speed: fullSpeedData,
        gForce: fullGForceData,
        timestamps: fullTimestamps
      });
      setCurrentDataIndex(0); // รีเซ็ตตำแหน่งเมื่อเปลี่ยนรถ
    }
  }, [activeIndex, telemetryData]);

  useEffect(() => {
    if (!svgRaw || telemetryData.length === 0) return
    const svgEl = document.getElementById('svg-track')
    const pathEl = svgEl?.querySelector('#track')
    if (pathEl && pathEl instanceof SVGPathElement) {
      pathRef.current = pathEl
      const length = pathEl.getTotalLength()
      setPathLength(length)
      meterPerPixelRef.current = trackRealDistance / length
      setIsRunning(true)
    }
  }, [svgRaw, telemetryData])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastTimeRef.current = performance.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // useEffect(() => {
  //   if (!pathRef.current || !isRunning || telemetryData.length === 0) return

  //   let elapsedTimes = telemetryData.map(() => 0)
  //   let indexes = telemetryData.map(() => 0)

  //   const animate = (time) => {
  //     if (!lastTimeRef.current) lastTimeRef.current = time
  //     const deltaTime = (time - lastTimeRef.current) / 1000
  //     lastTimeRef.current = time

  //     setProgresses((prev) => {
  //       const next = [...prev]

  //       telemetryData.forEach((carData, i) => {
  //         // ตรวจสอบว่า carData มีข้อมูลและ index ไม่เกินขนาด array
  //         if (carData && indexes[i] < carData.length) {
  //           const currentData = carData[indexes[i]]

  //           // ตรวจสอบว่า currentData มีข้อมูลที่จำเป็น
  //           if (currentData && typeof currentData.speed === 'number') {
  //             const speedInMs = (currentData.speed * 1000) / 3600
  //             const distance = speedInMs * deltaTime
  //             const pixelMove = distance / meterPerPixelRef.current
  //             next[i] = (next[i] - pixelMove + pathLength) % pathLength

  //             elapsedTimes[i] += deltaTime
  //             // เพิ่มความถี่ในการอัพเดท index เป็น 1 วินาที (เนื่องจากกรอง data แล้ว)
  //             if (elapsedTimes[i] >= 1) {
  //               indexes[i]++
  //               elapsedTimes[i] = 0
                
  //               // รีเซ็ต index หากเกินขนาด array
  //               if (indexes[i] >= carData.length) {
  //                 indexes[i] = 0 // วนกลับไปเริ่มใหม่
  //               }

  //               // อัพเดทข้อมูลรถพร้อมเก็บข้อมูลกราฟ (ทุก 1 วินาที)
  //               handleNewCarData(i, currentData.speed || 0, currentData.x || 0, currentData.y || 0, true)
  //             } else {
  //               // อัพเดทข้อมูลรถโดยไม่เก็บข้อมูลกราฟ (ระหว่างวินาที)
  //               handleNewCarData(i, currentData.speed || 0, currentData.x || 0, currentData.y || 0, false)
  //             }
  //           }
  //         }
  //       })
  //       return next
  //     })

  //     animationRef.current = requestAnimationFrame(animate)
  //   }

  //   animationRef.current = requestAnimationFrame(animate)
  //   return () => cancelAnimationFrame(animationRef.current)
  // }, [isRunning, telemetryData])

   // แก้ไข animation loop
  useEffect(() => {
    if (!pathRef.current || !isRunning || telemetryData.length === 0 || dataIndexes.length === 0) return

    let elapsedTimes = telemetryData.map(() => 0)

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const deltaTime = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      setProgresses((prev) => {
        const next = [...prev]
        
        setDataIndexes((prevIndexes) => {
          const newIndexes = [...prevIndexes]
          let shouldUpdateChart = false; // flag สำหรับอัปเดตกราฟ
          
          telemetryData.forEach((carData, i) => {
            if (carData && newIndexes[i] < carData.length) {
              const currentData = carData[newIndexes[i]]

              if (currentData && typeof currentData.speed === 'number') {
                const speedInMs = (currentData.speed * 1000) / 3600
                const distance = speedInMs * deltaTime
                const pixelMove = distance / meterPerPixelRef.current
                next[i] = (next[i] - pixelMove + pathLength) % pathLength

                elapsedTimes[i] += deltaTime
                if (elapsedTimes[i] >= 1) {
                  newIndexes[i]++
                  elapsedTimes[i] = 0
                  
                  if (newIndexes[i] >= carData.length) {
                    newIndexes[i] = 0
                  }

                  // อัพเดทข้อมูลรถ
                  handleNewCarData(i, currentData.speed || 0, currentData.x || 0, currentData.y || 0, true)
                  
                  // ถ้าเป็นรถที่ถูกเลือก ให้อัปเดต chart indicator
                  if (i === activeIndex) {
                    shouldUpdateChart = true;
                  }
                } else {
                  handleNewCarData(i, currentData.speed || 0, currentData.x || 0, currentData.y || 0, false)
                }
              }
            }
          })
          
          // อัปเดต currentDataIndex ทันทีเมื่อมีการเปลี่ยนแปลง
          if (shouldUpdateChart && newIndexes[activeIndex] !== undefined) {
            setCurrentDataIndex(newIndexes[activeIndex]);
          }
          
          return newIndexes
        })

        return next
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [isRunning, telemetryData, dataIndexes.length, activeIndex])

  // เพิ่ม useEffect สำหรับอัปเดต currentDataIndex
  useEffect(() => {
    if (dataIndexes.length > 0 && dataIndexes[activeIndex] !== undefined) {
      setCurrentDataIndex(dataIndexes[activeIndex]);
    }
  }, [dataIndexes, activeIndex]);

  useEffect(() => {
    if (!pathRef.current) return
    progresses.forEach((progress, i) => {
      if (!isFinite(progress)) return
      const point = pathRef.current.getPointAtLength(progress)
      if (carRefs[i]?.current) {
        carRefs[i].current.setAttribute('cx', point.x.toString())
        carRefs[i].current.setAttribute('cy', point.y.toString())
      }
    })
  }, [progresses])

  // ฟังก์ชันสร้าง Plugin สำหรับเส้นแนวตั้ง
  const createVerticalLinePlugin = (currentIndex) => ({
    id: 'verticalLine',
    afterDraw: (chart) => {
      // ตรวจสอบให้แน่ใจว่ามีข้อมูลและ index ถูกต้อง
      if (currentIndex >= 0 && 
          currentIndex < fullChartData.timestamps.length && 
          fullChartData.timestamps.length > 0) {
        
        const ctx = chart.ctx;
        const xAxis = chart.scales.x;
        const yAxis = chart.scales.y;
        
        // คำนวณตำแหน่ง x ของเส้นแนวตั้ง
        const x = xAxis.getPixelForValue(currentIndex);
        
        // ตรวจสอบว่า x อยู่ในขอบเขตที่เห็นได้
        if (x >= xAxis.left && x <= xAxis.right) {
          // วาดเส้นแนวตั้ง
          ctx.save();
          ctx.strokeStyle = '#ff0000'; // สีแดง
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]); // เส้นประ
          ctx.beginPath();
          ctx.moveTo(x, yAxis.top);
          ctx.lineTo(x, yAxis.bottom);
          ctx.stroke();
          ctx.restore();

          // วาดจุดบนเส้น
          const speedValue = fullChartData.speed[currentIndex];
          const gForceValue = fullChartData.gForce[currentIndex];
          
          if (chart.config.data.datasets[0].label.includes('Speed') && speedValue !== undefined) {
            const y = yAxis.getPixelForValue(speedValue);
            ctx.save();
            ctx.fillStyle = '#ff0000';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          } else if (chart.config.data.datasets[0].label.includes('G-Force') && gForceValue !== undefined) {
            const y = yAxis.getPixelForValue(gForceValue);
            ctx.save();
            ctx.fillStyle = '#ff0000';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }
  });

  // เพิ่มการรีเซ็ต currentDataIndex เมื่อกดปุ่ม Start/Stop
  const handleStart = () => {
    if (!isRunning && telemetryData.length > 0) {
      setProgresses(Array(telemetryData.length).fill(startingPoint))
      setDataIndexes(Array(telemetryData.length).fill(0)) // รีเซ็ต indexes
      setCurrentDataIndex(0) // รีเซ็ตตำแหน่งเริ่มต้น
      lastTimeRef.current = null
      setIsRunning(true)
    }
  }

  const handleStop = () => {
    cancelAnimationFrame(animationRef.current)
    setIsRunning(false)
    setProgresses(Array(telemetryData.length).fill(startingPoint))
    setDataIndexes(Array(telemetryData.length).fill(0)) // รีเซ็ต indexes
    setCurrentDataIndex(0) // รีเซ็ตตำแหน่งเมื่อหยุด
    lastTimeRef.current = null
  }

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.1, 3))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.1, 0.5))

  const handleMouseDown = (e) => {
    setDragging(true)
    offsetRef.current = {
      x: e.clientX - widgetPosition.x,
      y: e.clientY - widgetPosition.y,
    }
  }

  const handleMouseMove = (e) => {
    if (!dragging) return
    setWidgetPosition({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    })
  }

  const handleMouseUp = () => setDragging(false)

  const handleWheel = (e) => {
    if (e.deltaY < 0) handleZoomIn()
    else handleZoomOut()
  }

  const handleMapMouseDown = (e) => {
    // ป้องกันไม่ให้ชนกับ dragging widget
    if (dragging) return
  
    isPanningRef.current = true
    panStartRef.current = { x: e.clientX, y: e.clientY }
  }
  
  const handleMapMouseMove = (e) => {
    if (!isPanningRef.current) return
  
    const dx = e.clientX - panStartRef.current.x
    const dy = e.clientY - panStartRef.current.y
    panStartRef.current = { x: e.clientX, y: e.clientY }
  
    setCameraOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
  }
  
  const handleMapMouseUp = () => {
    isPanningRef.current = false
  }

  // ฟังก์ชันอัพเดทเฉพาะข้อมูลรถที่ถูกเลือก
  const handleNewCarData = (carId, newSpeed, newx, newy, shouldUpdateChart = false) => {
    setCarData(prevData => ({
      ...prevData,
      [carId]: {
        speed: newSpeed,
        x: newx,
        y: newy
      },
    }));

    // เก็บข้อมูลสำหรับกราฟเฉพาะเมื่อ shouldUpdateChart เป็น true
    if (shouldUpdateChart && carId === activeIndex) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      const gForce = Math.sqrt(newx * newx + newy * newy); // คำนวณ G-Force รวม

      setChartData(prevChart => {
        const newSpeedData = [...prevChart.speed, newSpeed];
        const newGForceData = [...prevChart.gForce, gForce];
        const newTimestamps = [...prevChart.timestamps, timestamp];

        // จำกัดจำนวนจุดข้อมูลเป็น 50 จุดล่าสุด
        return {
          speed: newSpeedData.slice(-maxDataPoints),
          gForce: newGForceData.slice(-maxDataPoints),
          timestamps: newTimestamps.slice(-maxDataPoints)
        };
      });
    }
  };


  if (!svgRaw || telemetryData.length === 0) return <p>Loading map or data...</p>

  const carColors = ['#FF0004', '#272AEE', '#FE24AE', '#00C46F', '#F6C100']

  return (
    <div
      className="bg-body-tertiary min-vh-100 d-flex flex-column"
      style={{ background: 'linear-gradient(to bottom, #D8DADD 0%, #5C5F65 100%)' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <header 
        className="d-flex justify-content-between align-items-center px-4 py-2"
      >
        <div className="d-flex align-items-center">
          <img src="/imgs/embedded-linux-logo.png" alt="Company Logo" style={{ height: '40px', marginRight: '10px' }} />
        </div>
        <div>
          <h5 className="mb-0 fw-bold">Chang International Circuit</h5>
        </div>
      </header>

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <div
          style={{
            width: '80px', // fit-content
            transition: 'width 0.3s ease',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #ccc',
            overflowY: 'auto',
            alignSelf: 'flex-start',
            maxWidth: '100%',
            maxHeight: '100%', // กัน Sidebar ยาวเกิน
            borderTopRightRadius: '15px',
            borderBottomRightRadius: '15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div
            className="px-2 shadow-sm text-center"
            style={{
              backgroundColor: 'gray',
              color: 'white',
              fontSize: '1.1rem',
            }}
          >
            CARS
          </div>

            {telemetryData.map((carData, i) => (
              <div
                key={i}
                className="px-2 py-1 shadow-sm"
                style={{
                  backgroundColor:
                    activeIndex === i
                      ? '#a8dadc'
                      : i % 2 === 0
                      ? '#f0f0f0'
                      : '#e0e0e0',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={(e) => {
                  if (activeIndex !== i) {
                    e.currentTarget.style.backgroundColor = '#d0d0d0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeIndex !== i) {
                    e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? '#f0f0f0' : '#e0e0e0';
                  }
                }}
              >
                <span style={{marginRight: '8px'}}>{i + 1}</span>
                <div
                  style={{
                    width: '6px',
                    height: '14px',
                    backgroundColor: carColors[i % carColors.length], // สีของรถ
                    marginRight: '8px',
                  }}
                ></div>
                <strong>#{carFiles[i].match(/car([a-zA-Z0-9]+)\.json/)[1] ?? 'N/A'}</strong>
              </div>
            ))}
        </div>

        {/* Content area */}
        <div
          style={{
            marginLeft: '10px',
            marginBottom: '20px',
            padding: isCollapsed ? '0px' : '20px',
            flex: isCollapsed ? '0' : '1',
            width: isCollapsed ? '0' : 'auto',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(to right, #FFFFFF 0%, #CDCDCD 100%)',
            position: 'relative',
            borderRadius: '11px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
          }}
        >

          {/* Collapsed Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              position: 'absolute',
              top: '50%',
              right: '-15px',
              transform: 'translateY(-50%)',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <FontAwesomeIcon
              icon={isCollapsed ? faAngleRight : faAngleLeft}
              style={{ fontSize: '14px', color: '#ffffff' }}
            />
          </button>

          {!isCollapsed && (
            <div style={{ width: '400px' }}>
              
              {/* Tab Navigation */}
              <div style={{ 
                display: 'flex',
                marginBottom: '20px',
                gap: '8px'  // เพิ่มระยะห่างระหว่างปุ่ม
              }}>
                <button
                  onClick={() => setActiveTab(1)}
                  style={{
                    padding: '2px 24px',
                    border: 'none',
                    backgroundColor: activeTab === 1 ? '#c0c0c0' : '#f0f0f0',  // สีเงินเข้ม/อ่อน
                    color: activeTab === 1 ? '#333333' : '#666666',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    borderRadius: '12px',  // มุมมน
                    transition: 'all 0.3s ease',
                    boxShadow: activeTab === 1 
                      ? 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)'  // เงานูน active
                      : '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)',  // เงานูนปกติ
                    transform: activeTab === 1 ? 'translateY(1px)' : 'translateY(0px)',  // กดลง
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 1) {
                      e.target.style.backgroundColor = '#e8e8e8'  // hover สีเงิน
                      e.target.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.08)'
                      e.target.style.transform = 'translateY(-1px)'  // ยกขึ้น
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 1) {
                      e.target.style.backgroundColor = '#f0f0f0'
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)'
                      e.target.style.transform = 'translateY(0px)'
                    }
                  }}
                >
                  Live Data
                </button>
                
                <button
                  onClick={() => setActiveTab(2)}
                  style={{
                    padding: '2px 24px',
                    border: 'none',
                    backgroundColor: activeTab === 2 ? '#c0c0c0' : '#f0f0f0',  // สีเงินเข้ม/อ่อน
                    color: activeTab === 2 ? '#333333' : '#666666',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    borderRadius: '12px',  // มุมมน
                    transition: 'all 0.3s ease',
                    boxShadow: activeTab === 2 
                      ? 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)'  // เงานูน active
                      : '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)',  // เงานูนปกติ
                    transform: activeTab === 2 ? 'translateY(1px)' : 'translateY(0px)',  // กดลง
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 2) {
                      e.target.style.backgroundColor = '#e8e8e8'  // hover สีเงิน
                      e.target.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.08)'
                      e.target.style.transform = 'translateY(-1px)'  // ยกขึ้น
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 2) {
                      e.target.style.backgroundColor = '#f0f0f0'
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)'
                      e.target.style.transform = 'translateY(0px)'
                    }
                  }}
                >
                  Analytics
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 1 && (
                <>
                  {/* Driver Section - แท็บ 1 */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      height: '100%',
                    }}
                  >
                    {/* Column 1: Driver Image */}
                    <div style={{ flexBasis: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img
                        src="/imgs/telemetry/mockup_driver.png"
                        alt="Car"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                      />
                    </div>

                    {/* Column 2: Driver Info */}
                    <div
                      style={{
                        flexBasis: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'left',
                      }}
                    >
                      {/* Row 1 */}
                      <div style={{ textAlign: 'left', lineHeight: 1 }}>
                        <p style={{ margin: 0, padding: 0, fontSize: '2.2rem', fontStyle: 'italic' }}><b>DEMO NAME</b></p>
                        <p
                          style={{
                            fontSize: '1rem',
                            color: '#888888',
                            margin: '2px 0 0 0',
                            padding: 0,
                            fontStyle: 'italic'
                          }}
                        >
                          DEMO Motorsport
                        </p>
                      </div>
                      
                      {/* Row 2 */}
                      <div
                        className="mt-3"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <img
                          src="/imgs/telemetry/mockup_car.png"
                          alt="Car Icon"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                        <div style={{ textAlign: 'left', lineHeight: 1 }}>
                          <p style={{ margin: 0, padding: 0, fontSize: '2rem', fontStyle: 'italic' }}><b><strong>#{carFiles[activeIndex].match(/car([a-zA-Z0-9]+)\.json/)[1] ?? 'N/A'}</strong></b></p>
                          <p
                            style={{
                              fontSize: '1rem',
                              color: '#888888',
                              margin: '2px 0 0 0',
                              padding: 0,
                              fontStyle: 'italic'
                            }}
                          >
                            MAZDA MX7
                          </p>
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div
                        className="mt-3"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <img
                          src="/imgs/telemetry/mockup_nation.png"
                          alt="Car"
                          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                      </div>
                    </div>   
                  </div>
                  
                  {/* Data Section - แท็บ 1 */}
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        width: '100%',
                        gap: '20px',
                      }}
                    >
                      {/* Speed Gauge */}
                      <div
                        style={{
                          width: '50%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >

                        {carData[activeIndex] && (
                          <>
                            <SpeedGaugeChart value={carData[activeIndex].speed} unit="KM/H" name="SPEED" />
                            <span style={{ fontWeight: 'bold', marginTop: '6px' }}>Speed Gauge</span>
                          </>
                        )}
                      </div>

                      {/* G-Force Meter */}
                      <div
                        style={{
                          width: '50%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        {/* <GForceMeter gForceData={{ x: 0, y: 0, max: 2 }} />
                        <span style={{ fontWeight: 'bold', marginTop: '6px' }}>G-Force Meter</span> */}

                        {carData[activeIndex] && (
                          <>
                            <GForceMeter gForceData={{ x: carData[activeIndex].x, y: carData[activeIndex].y, max: 2 }} />
                            <span style={{ fontWeight: 'bold', marginTop: '6px' }}>G-Force Meter</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tab 2 Content - Analytics */}
              {activeTab === 2 && (
                  <div style={{
                    height: '500px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '10px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#c0c0c0 #f0f0f0'
                  }}>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                      paddingRight: '5px'
                    }}>

                      {/* Charts Container */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '25px'
                      }}>
                        
                        {/* Speed Chart */}
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          padding: '15px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          minHeight: '200px'
                        }}>
                          <h4 style={{ 
                            margin: '0 0 15px 0', 
                            fontSize: '1.2rem', 
                            color: '#333',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}>
                            Speed Chart (KM/H) - Full Data
                          </h4>
                          <div style={{ height: '180px' }}>
                            <Line
                              plugins={[createVerticalLinePlugin(currentDataIndex)]}
                              data={{
                                labels: fullChartData.timestamps,
                                datasets: [
                                  {
                                    label: 'Speed (KM/H)',
                                    data: fullChartData.speed,
                                    borderColor: '#ff6b6b',
                                    backgroundColor: 'rgba(255, 107, 107, 0.15)',
                                    borderWidth: 2,
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 0,
                                    pointHoverRadius: 6,
                                    pointBackgroundColor: '#ff6b6b',
                                    pointBorderColor: '#ffffff',
                                    pointBorderWidth: 2
                                  }
                                ]
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                animation: false, // ปิด animation เพื่อประสิทธิภาพ
                                plugins: {
                                  legend: {
                                    display: false
                                  },
                                  tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    titleColor: '#fff',
                                    bodyColor: '#fff',
                                    borderColor: '#ff6b6b',
                                    borderWidth: 1,
                                    callbacks: {
                                      title: function(context) {
                                        return `Time: ${context[0].label}`;
                                      },
                                      label: function(context) {
                                        return `Speed: ${context.parsed.y.toFixed(1)} km/h`;
                                      }
                                    }
                                  }
                                },
                                scales: {
                                  x: {
                                    display: true,
                                    grid: {
                                      color: 'rgba(0,0,0,0.1)'
                                    },
                                    ticks: {
                                      maxTicksLimit: 10,
                                      font: {
                                        size: 10
                                      }
                                    }
                                  },
                                  y: {
                                    beginAtZero: true,
                                    max: Math.max(200, Math.max(...fullChartData.speed) + 20),
                                    grid: {
                                      color: 'rgba(0,0,0,0.1)'
                                    },
                                    ticks: {
                                      font: {
                                        size: 11
                                      },
                                      callback: function(value) {
                                        return value + ' km/h';
                                      }
                                    }
                                  }
                                },
                                elements: {
                                  line: {
                                    borderJoinStyle: 'round'
                                  },
                                  point: {
                                    radius: 0,
                                    hoverRadius: 6
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* G-Force Chart */}
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          padding: '15px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          minHeight: '200px'
                        }}>
                          <h4 style={{ 
                            margin: '0 0 15px 0', 
                            fontSize: '1.2rem', 
                            color: '#333',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}>
                            G-Force Chart - Full Data
                          </h4>
                          <div style={{ height: '180px' }}>
                            <Line
                              plugins={[createVerticalLinePlugin(currentDataIndex)]}
                              data={{
                                labels: fullChartData.timestamps,
                                datasets: [
                                  {
                                    label: 'G-Force',
                                    data: fullChartData.gForce,
                                    borderColor: '#4ecdc4',
                                    backgroundColor: 'rgba(78, 205, 196, 0.15)',
                                    borderWidth: 2,
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 0,
                                    pointHoverRadius: 6,
                                    pointBackgroundColor: '#4ecdc4',
                                    pointBorderColor: '#ffffff',
                                    pointBorderWidth: 2
                                  }
                                ]
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                animation: false,
                                plugins: {
                                  legend: {
                                    display: false
                                  },
                                  tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    titleColor: '#fff',
                                    bodyColor: '#fff',
                                    borderColor: '#4ecdc4',
                                    borderWidth: 1,
                                    callbacks: {
                                      title: function(context) {
                                        return `Time: ${context[0].label}`;
                                      },
                                      label: function(context) {
                                        return `G-Force: ${context.parsed.y.toFixed(2)}g`;
                                      }
                                    }
                                  }
                                },
                                scales: {
                                  x: {
                                    display: true,
                                    grid: {
                                      color: 'rgba(0,0,0,0.1)'
                                    },
                                    ticks: {
                                      maxTicksLimit: 10,
                                      font: {
                                        size: 10
                                      }
                                    }
                                  },
                                  y: {
                                    beginAtZero: true,
                                    max: Math.max(3, Math.max(...fullChartData.gForce) + 0.5),
                                    grid: {
                                      color: 'rgba(0,0,0,0.1)'
                                    },
                                    ticks: {
                                      font: {
                                        size: 11
                                      },
                                      callback: function(value) {
                                        return value.toFixed(1) + 'g';
                                      }
                                    }
                                  }
                                },
                                elements: {
                                  line: {
                                    borderJoinStyle: 'round'
                                  },
                                  point: {
                                    radius: 0,
                                    hoverRadius: 6
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Current Position Info */}
                      <div style={{
                        backgroundColor: '#fff3cd',
                        borderRadius: '8px',
                        padding: '10px',
                        textAlign: 'center',
                        border: '1px solid #ffeaa7'
                      }}>
                        <div style={{ fontSize: '0.9rem', color: '#856404' }}>
                          <strong>Current Position:</strong> {currentDataIndex + 1} / {fullChartData.timestamps.length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#856404', marginTop: '5px' }}>
                          Time: {fullChartData.timestamps[currentDataIndex] || '00:00'} | 
                          Speed: {fullChartData.speed[currentDataIndex]?.toFixed(1) || '0.0'} km/h | 
                          G-Force: {fullChartData.gForce[currentDataIndex]?.toFixed(2) || '0.00'}g
                        </div>
                      </div>

                      {/* Stats Summary */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        backgroundColor: '#e9ecef',
                        borderRadius: '10px',
                        padding: '15px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333' }}>
                            {fullChartData.speed.length > 0 ? Math.max(...fullChartData.speed).toFixed(1) : '0.0'}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Max Speed</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333' }}>
                            {fullChartData.speed.length > 0 ? (fullChartData.speed.reduce((a, b) => a + b, 0) / fullChartData.speed.length).toFixed(1) : '0.0'}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Avg Speed</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333' }}>
                            {fullChartData.gForce.length > 0 ? Math.max(...fullChartData.gForce).toFixed(2) : '0.00'}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Max G-Force</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333' }}>
                            {fullChartData.timestamps.length}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Total Points</div>
                        </div>
                      </div>

                    </div>

                    {/* Custom Scrollbar Styling */}
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        width: 8px;
                      }
                      
                      div::-webkit-scrollbar-track {
                        background: #f0f0f0;
                        border-radius: 4px;
                      }
                      
                      div::-webkit-scrollbar-thumb {
                        background: #c0c0c0;
                        border-radius: 4px;
                      }
                      
                      div::-webkit-scrollbar-thumb:hover {
                        background: #a0a0a0;
                      }
                    `}</style>

                  </div>
                )}

            </div> 
          )}
        </div>

        {/* Track & Map */}
        <div style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
          <div
            id="zoom-container"
            onMouseDown={handleMapMouseDown}
            onMouseMove={handleMapMouseMove}
            onMouseUp={handleMapMouseUp}
            style={{
              transform: `translate(${cameraOffset.x}px, ${cameraOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'top left',
              transition: isPanningRef.current ? 'none' : 'transform 0.3s ease',
              width: 'fit-content',
              cursor: isPanningRef.current ? 'grabbing' : 'grab',
            }}
          >
            <div id="svg-track" dangerouslySetInnerHTML={{ __html: svgRaw }} style={{ width: '100%' }} />
            <svg
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              width="100%"
              height="100%"
            >
              {carRefs.map((ref, i) => (
                <circle key={i} ref={ref} r={10} fill={carColors[i % carColors.length]} />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Widget Control */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: '#FFFFFF',
          borderRadius: '35px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        {!isRunning ? (
          <CButton 
            onClick={handleStart} 
            className="rounded-circle d-flex align-items-center justify-content-center custom-hover" 
            style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#DE0000', 
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
              transition: 'all 0.1s ease' 
            }}
          >
            <FontAwesomeIcon icon={faPlay} size="1x" style={{ color: '#D9D9D9' }} />
          </CButton>
        ) : (
          <CButton 
            onClick={handleStop} 
            className="rounded-circle d-flex align-items-center justify-content-center custom-hover" 
            style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#DE0000', 
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
              transition: 'all 0.1s ease' 
            }}
          >
            <FontAwesomeIcon icon={faStop} size="1x" style={{ color: '#D9D9D9' }} />
          </CButton>
        )}

        <CIcon icon={cilZoomIn} color="secondary" className="custom-hover" onClick={handleZoomIn} style={{ cursor: "pointer" }} />

        <CIcon icon={cilZoomOut} color="secondary" className="custom-hover" onClick={handleZoomOut} style={{ cursor: "pointer" }} />
      </div>

      <style jsx="true">{`
        .custom-hover:hover {
          opacity: 0.8;
        }
        .custom-hover:active {
          transform: scale(0.96);
        }
      `}</style>
    </div>
  )
}

export default Telemetry