import React, { useState, useEffect, useRef } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../../components/index'
import CIcon from '@coreui/icons-react'
import { cilBolt } from '@coreui/icons'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { string } from 'prop-types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const Driver = () => {
    const [loading, setLoading] = useState(false)
    const [carNumbers, setCarNumbers] = useState([])
    const [device, setDevice] = useState(null)

    const getPermitions = () => {
        setLoading(true)

        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        myHeaders.append('Authorization', 'Basic czYzOjU3YjQ2OGQ4MTFmOA==')

        const raw = JSON.stringify({
            pttoken:
                localStorage.getItem('pttoken')
        })

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        }

        fetch(`http://34.143.131.92:4000/permissions`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                setLoading(false)

                // Try mapping API response into car numbers; keep defaults if shape differs.
                try {
                    const parsed = JSON.parse(result)
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const mappedCars = parsed.map((item) =>
                            typeof item === 'string' ? item : String(item).padStart(2, '0'),
                        )
                        setCarNumbers(mappedCars)
                    }
                } catch (error) {
                    // Response is not JSON; keep default car numbers.
                }
            })
            .catch((error) => {
                console.error(error)
                setLoading(false)
            })
    }

    const getDevice = (carNum) => {
        setLoading(true)
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        myHeaders.append('Authorization', 'Basic czYzOjU3YjQ2OGQ4MTFmOA==')
        const raw = JSON.stringify({ car_number: carNum })
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        }
        fetch('http://34.143.131.92:4000/GetDevice', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                setLoading(false)
                try {
                    let device = JSON.parse(result)?.device_id
                    if (device) {
                        setDevice(device)
                        setSelectedCars([device])
                    }
                } catch (error) {
                    // Response is not JSON; keep default car numbers.
                }
            })
            .catch((error) => {
                console.error(error)
                setLoading(false)
            })
    }

    const [selectedCars, setSelectedCars] = useState([])
    const [carNum, setCarNum] = useState([])
    const [speedData, setSpeedData] = useState([])
    const [speedTimeLabels, setSpeedTimeLabels] = useState([])
    const [maxSpeed, setMaxSpeed] = useState(0)
    const [minSpeed, setMinSpeed] = useState(0)
    const [lambdaData, setLambdaData] = useState([])
    const [lambdaTimeLabels, setLambdaTimeLabels] = useState([])
    const [maxLambda, setMaxLambda] = useState(0)
    const [minLambda, setMinLambda] = useState(0)
    const [heartRateData, setHeartRateData] = useState([])
    const [heartRateTimeLabels, setHeartRateTimeLabels] = useState([])
    const [maxHeartRate, setMaxHeartRate] = useState(0)
    const [minHeartRate, setMinHeartRate] = useState(0)
    const wsRef = useRef(null)
    const carsActive = carNumbers.length
    const MAX_DATA_POINTS = 30

    useEffect(() => {
        getPermitions()
    }, [])

    const formatClockTime = (dateValue = new Date()) => {
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    }

    const pushWithLimit = (prevArray, value) => {
        const next = [...prevArray, value]
        if (next.length > MAX_DATA_POINTS) {
            next.shift()
        }
        return next
    }

    // WebSocket connection
    useEffect(() => {
        if (selectedCars.length === 0) {
            if (wsRef.current) {
                wsRef.current.close()
                wsRef.current = null
            }
            setSpeedData([])
            setSpeedTimeLabels([])
            setLambdaData([])
            setLambdaTimeLabels([])
            setHeartRateData([])
            setHeartRateTimeLabels([])
            return
        }

        const wsUrl = `${import.meta.env.VITE_SOCKET_URL}/car${selectedCars[0]}`
        console.log('Connecting to WebSocket:', wsUrl)
        wsRef.current = new WebSocket(wsUrl)

        wsRef.current.onopen = () => {
            console.log('WebSocket connected to car', selectedCars[0])
        }

        wsRef.current.onmessage = (event) => {
            try {
                let res = event.data
                if (typeof res === 'string') {
                    try {
                        res = JSON.parse(res)
                    } catch (e) {
                        res = eval(res)
                    }
                }
                console.log('Received WebSocket message:', res)
                const receivedAt = formatClockTime()
                if (Array.isArray(res) && res.length > 3) {
                    const speed = parseFloat(res[3])
                    if (!isNaN(speed)) {
                        setSpeedData((prevData) => {
                            const newData = pushWithLimit(prevData, Math.round(speed * 10) / 10)
                            if (newData.length > 0) {
                                setMaxSpeed(Math.max(...newData))
                                setMinSpeed(Math.min(...newData))
                            }
                            return newData
                        })
                        setSpeedTimeLabels((prevLabels) => pushWithLimit(prevLabels, receivedAt))
                    }
                }
                if (Array.isArray(res) && res.length > 7) {
                    const lambda = parseFloat(res[7])
                    if (!isNaN(lambda)) {
                        setLambdaData((prevData) => {
                            const newData = pushWithLimit(prevData, Math.round(lambda * 1000) / 1000)
                            if (newData.length > 0) {
                                setMaxLambda(Math.max(...newData))
                                setMinLambda(Math.min(...newData))
                            }
                            return newData
                        })
                        setLambdaTimeLabels((prevLabels) => pushWithLimit(prevLabels, receivedAt))
                    }
                }
                if (Array.isArray(res) && res.length > 16) {
                    const heartRate = parseFloat(res[16])
                    if (!isNaN(heartRate)) {
                        setHeartRateData((prevData) => {
                            const newData = pushWithLimit(prevData, Math.round(heartRate * 10) / 10)
                            if (newData.length > 0) {
                                setMaxHeartRate(Math.max(...newData))
                                setMinHeartRate(Math.min(...newData))
                            }
                            return newData
                        })
                        setHeartRateTimeLabels((prevLabels) => pushWithLimit(prevLabels, receivedAt))
                    }
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error, event.data)
            }
        }

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        wsRef.current.onclose = () => {
            console.log('WebSocket disconnected from car', selectedCars[0])
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [selectedCars])

    const toggleCarSelection = (carNum) => {
        setSpeedData([])
        setSpeedTimeLabels([])
        setLambdaData([])
        setLambdaTimeLabels([])
        setHeartRateData([])
        setHeartRateTimeLabels([])
        getDevice(carNum)
        setCarNum(carNum)
    }

    return (
        <div>
            <div className="flex flex-col h-full bg-[#050505] text-white relative overflow-hidden m-1">
                {/* Grid Status Bar */}
                <div style={{
                    backgroundColor: '#1a1a1a',
                    padding: '20px',
                    margin: '20px 20px 0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '40px',
                    borderBottom: '1px solid #404040',
                    borderRadius: '10px',
                    position: 'relative',
                }}>
                                        {/* Label NUMBER : ... อยู่ในกรอบนี้ */}
                                        {selectedCars.length > 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 20,
                                                right: 32,
                                                color: '#8DFF3B',
                                                fontWeight: 900,
                                                fontSize: '2.8rem',
                                                letterSpacing: '2px',
                                                background: 'none',
                                                border: 'none',
                                                padding: 0,
                                                margin: 0,
                                                textAlign: 'right',
                                                fontFamily: 'inherit',
                                            }}>
                                               NUMBER : {carNum} / DEVICE : {selectedCars[0]}
                                            </div>
                                        )}
                    {/* Status Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: '#999',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                GRID STATUS
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '900',
                                color: '#fff',
                                lineHeight: '1'
                            }}>
                                {carsActive}   Cars Active
                            </div>
                        </div>
                    </div>

                    {/* Car Numbers Grid */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        flex: 1
                    }}>
                        {carNumbers.map(carNum => (
                            <button
                                key={carNum}
                                onClick={() => toggleCarSelection(carNum)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#2a2a2a',
                                    color: selectedCars.includes(carNum) ? '#fff' : '#999',
                                    border: selectedCars.includes(carNum) ? '2px solid #fff' : '1px solid #404040',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.1)'
                                    if (!selectedCars.includes(carNum)) {
                                        e.target.style.backgroundColor = '#333'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)'
                                    if (!selectedCars.includes(carNum)) {
                                        e.target.style.backgroundColor = '#2a2a2a'
                                    }
                                }}
                            >
                                {carNum}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    {selectedCars.length > 0 && (
                        <>
                            {/* Speed Chart */}
                            <div style={{
                                backgroundColor: '#1a1a1a',
                                borderRadius: '8px',
                                padding: '20px',
                                border: '1px solid #404040',
                                flex: 1
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <div>
                                        <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>
                                            ⚡ SPEED
                                        </h3>
                                        <p style={{ color: '#999', fontSize: '0.85rem', margin: '5px 0 0 0' }}>
                                            LIMIT: 318 km/h
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#D9FF00', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            ↑ {maxSpeed}
                                        </div>
                                        <div style={{ color: '#999', fontSize: '0.85rem', marginTop: '5px' }}>
                                            ↓ {minSpeed}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: '100px' }}>
                                    <Line
                                        data={{
                                            labels: speedTimeLabels,
                                            datasets: [{
                                                label: `Car ${selectedCars[0]}`,
                                                data: speedData,
                                                borderColor: '#00BFFF',
                                                backgroundColor: 'rgba(0, 191, 255, 0.15)',
                                                tension: 0.4,
                                                fill: true,
                                                borderWidth: 3,
                                                pointRadius: 3,
                                                pointBackgroundColor: '#00BFFF',
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            interaction: {
                                                mode: 'index',
                                                intersect: false
                                            },
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                                tooltip: {
                                                    enabled: true,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    borderColor: '#00BFFF',
                                                    borderWidth: 2,
                                                    titleColor: '#fff',
                                                    bodyColor: '#D9FF00',
                                                    padding: 10,
                                                    displayColors: false,
                                                    caretPadding: 10
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    ticks: { color: '#666', font: { size: 10 } },
                                                    grid: { color: '#2a2a2a' }
                                                },
                                                y: {
                                                    ticks: { color: '#666', font: { size: 10 } },
                                                    grid: { color: '#2a2a2a' },
                                                    min: 0,
                                                    max: 350
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Lambda Chart */}
                            <div style={{
                                backgroundColor: '#1a1a1a',
                                borderRadius: '8px',
                                padding: '20px',
                                border: '1px solid #404040',
                                flex: 1
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <div>
                                        <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>
                                            <CIcon
                                                icon={cilBolt}
                                                size="sm"
                                                style={{ color: '#00BFFF', verticalAlign: 'middle', marginRight: '6px' }}
                                            />
                                            LAMBDA
                                        </h3>
                                        <p style={{ color: '#999', fontSize: '0.85rem', margin: '5px 0 0 0' }}>
                                            LIMIT: 2 λ
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#D9FF00', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            ↑ {maxLambda}
                                        </div>
                                        <div style={{ color: '#999', fontSize: '0.85rem', marginTop: '5px' }}>
                                            ↓ {minLambda}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: '100px' }}>
                                    <Line
                                        data={{
                                            labels: lambdaTimeLabels,
                                            datasets: [{
                                                label: `Car ${selectedCars[0]}`,
                                                data: lambdaData,
                                                borderColor: '#D9FF00',
                                                backgroundColor: 'rgba(217, 255, 0, 0.2)',
                                                tension: 0.4,
                                                fill: true,
                                                borderWidth: 3,
                                                pointRadius: 3,
                                                pointBackgroundColor: '#D9FF00',
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            interaction: {
                                                mode: 'index',
                                                intersect: false
                                            },
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                                tooltip: {
                                                    enabled: true,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    borderColor: '#D9FF00',
                                                    borderWidth: 2,
                                                    titleColor: '#fff',
                                                    bodyColor: '#D9FF00',
                                                    padding: 10,
                                                    displayColors: false,
                                                    caretPadding: 10
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    ticks: { color: '#666', font: { size: 10 } },
                                                    grid: { color: '#2a2a2a' }
                                                },
                                                y: {
                                                    ticks: { color: '#666', font: { size: 10 } },
                                                    grid: { color: '#2a2a2a' },
                                                    min: 0,
                                                    max: 2
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/*  Heart Rate Chart */}
                            <div style={{
                                backgroundColor: '#1a1a1a',
                                borderRadius: '8px',
                                padding: '20px',
                                border: '1px solid #404040',
                                flex: 1
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <div>
                                        <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>
                                            ❤️ Heart Rate
                                        </h3>
                                        <p style={{ color: '#999', fontSize: '0.85rem', margin: '5px 0 0 0' }}>
                                            LIMIT: 300 bpm
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#D9FF00', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            ↑ {maxHeartRate}
                                        </div>
                                        <div style={{ color: '#999', fontSize: '0.85rem', marginTop: '5px' }}>
                                            ↓ {minHeartRate}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: '100px' }}>
                                    <Line
                                        data={{
                                            labels: heartRateTimeLabels,
                                            datasets: [{
                                                label: `Car ${selectedCars[0]}`,
                                                data: heartRateData,
                                                borderColor: '#FF1493',
                                                backgroundColor: 'rgba(255, 20, 147, 0.15)',
                                                tension: 0.4,
                                                fill: true,
                                                borderWidth: 3,
                                                pointRadius: 3,
                                                pointBackgroundColor: '#FF1493',
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            interaction: {
                                                mode: 'index',
                                                intersect: false
                                            },
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                                tooltip: {
                                                    enabled: true,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    borderColor: '#FF1493',
                                                    borderWidth: 2,
                                                    titleColor: '#fff',
                                                    bodyColor: '#FF1493',
                                                    padding: 10,
                                                    displayColors: false,
                                                    caretPadding: 10
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    ticks: { color: '#666', font: { size: 10 } },
                                                    grid: { color: '#2a2a2a' }
                                                },
                                                y: {
                                                    ticks: { color: '#666', font: { size: 10 } },
                                                    grid: { color: '#2a2a2a' },
                                                    min: 50,
                                                    max: 200
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {selectedCars.length === 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#666',
                            fontSize: '1.1rem'
                        }}>
                            กรุณาเลือกรถเพื่อดูข้อมูลประสิทธิภาพ
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Driver
