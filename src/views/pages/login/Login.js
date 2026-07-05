import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronRight } from '@coreui/icons'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Prepare API request
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    const raw = JSON.stringify({
      "username": username,
      "password": password
    })

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    }

    localStorage.clear('pttoken') // Clear any existing tokens

    // Call login API
    fetch(`${import.meta.env.VITE_BASE_API_LOGIN_URL}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Login failed: ${response.status}`)
        }
        return response.json()
      })
      .then((result) => {
        setLoading(false)
        // Save token and redirect to dashboard
        localStorage.setItem('pttoken', result.pttoken)
        window.location.href = '/#/dashboard' // Redirect to driver dashboard
        window.location.reload()
      })
      .catch((error) => {
        console.error("Login error:", error)
        setLoading(false)
        alert("Login failed: " + error.message)
      })
  }

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center align-content-center position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #021518 0%, #0a2c2e 100%)',
        fontFamily: "'FCSaveSpace', sans-serif",
      }}
    >
      {/* Background Effects */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        {/* Horizon Line with Animation */}
        <div
          className="position-absolute w-100"
          style={{
            top: '35%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #D9FF00, transparent)',
            opacity: loading ? 0.8 : 0.2,
            boxShadow: loading ? '0 0 20px rgba(217,255,0,0.8)' : 'none',
            transition: 'all 0.5s ease',
          }}
        >
          {loading && (
            <div
              className="position-absolute"
              style={{
                top: '-2px',
                left: '-20%',
                width: '15%',
                height: '5px',
                background: 'linear-gradient(to right, transparent, white, transparent)',
                filter: 'blur(3px)',
                borderRadius: '10px',
                animation: 'pulse-line 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }}
            />
          )}
        </div>

        <div
          className="position-absolute rounded-circle"
          style={{
            top: '40%',
            left: '-20%',
            width: '50%',
            height: '300px',
            background: '#D9FF00',
            opacity: 0.05,
            filter: 'blur(100px)',
          }}
        />
        <div
          className="position-absolute rounded-circle"
          style={{
            bottom: '20%',
            right: '-10%',
            width: '40%',
            height: '200px',
            background: 'white',
            opacity: 0.02,
            filter: 'blur(80px)',
          }}
        />
      </div>

      <CContainer style={{ zIndex: 10 }} className="d-flex justify-content-center align-items-center">
        <CRow className="w-100 justify-content-center">
          <CCol lg={5} md={6} xs={12} className="px-3">
            {/* Logo Section */}
            <div className="text-center mb-5" style={{ opacity: loading ? 0.8 : 1, transform: loading ? 'scale(0.9)' : 'scale(1)', transition: 'all 0.7s ease' }}>
              <div className="position-relative mb-4 d-flex justify-content-center">
                <div
                  className="position-absolute rounded-circle"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(217,255,0,0.05) 40%, transparent 70%)',
                    filter: 'blur(48px)',
                    transform: 'scale(4)',
                    width: '200px',
                    height: '200px',
                    zIndex: 0,
                  }}
                />
                <img
                  src="/imgs/pt-racing-logo.png"
                  alt="PT RACING SERIES"
                  style={{
                    filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.4)) drop-shadow(0 0 60px rgba(217,255,0,0.3))',
                    height: 'auto',
                    maxHeight: '250px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  className="img-fluid"
                />
              </div>
              <p className="text-muted small fw-bold text-uppercase tracking-wide" style={{ letterSpacing: '0.1em', fontSize: '1.1rem' }}>
                Race director & Steward Division
              </p>
            </div>

            {/* Login Form */}
            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="warning" className="mb-3" />
                <p
                  className="small fw-bold text-uppercase"
                  style={{
                    letterSpacing: '0.05em',
                    color: '#D9FF00',
                    animation: 'pulse 1.5s infinite',
                    fontSize: '1.1rem',
                  }}
                >
                  INITIALIZING TELEMETRY STREAMS...
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <CCard
                  className="border-0"
                  style={{
                    background: 'transparent',
                  }}
                >
                  <CCardBody className="px-0">
                    <CForm onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <CFormInput
                          type="text"
                          placeholder="Username"
                          autoComplete="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          style={{
                            fontSize: '1.5rem',
                          }}
                          className="form-control-lg"
                        />
                      </div>

                      <div className="mb-5">
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{
                            fontSize: '1.5rem',
                          }}
                          className="form-control-lg"
                        />
                      </div>

                      <CButton
                        type="submit"
                        className="w-100 fw-bold text-dark"
                        style={{
                          background: '#D9FF00',
                          border: 'none',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.5rem',
                          textTransform: 'uppercase',
                          fontSize: '2rem',
                          letterSpacing: '0.08em',
                          fontWeight: '900',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
                        onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
                      >
                        <span style={{fontSize: '1.5rem', fontWeight: 100, letterSpacing: '0.08em'}}>LOGIN</span>
                        <CIcon icon={cilChevronRight} size="lg" style={{ marginTop: '2px' }} />
                      </CButton>
                    </CForm>
                  </CCardBody>
                </CCard>
              </div>
            )}

            {/* Footer Info */}
            {!loading && (
              <div className="text-center mt-5">
                <p className="text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  PT MAXNITRON RACING TECHNOLOGY
                </p>
                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: 0 }}>
                  PT MAXNITRON RACING V1.0.0
                </p>
              </div>
            )}
          </CCol>
        </CRow>
      </CContainer>

      <style>{`
        @keyframes pulse-line {
          0% { left: -20%; opacity: 0; }
          5% { opacity: 1; }
          50% { left: 120%; opacity: 0; }
          100% { left: 120%; opacity: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .tracking-wide {
          letter-spacing: 0.1em;
        }

        input::placeholder {
          color: rgba(255,255,255,0.4) !important;
        }

        input:focus {
          background-color: rgba(255,255,255,0.12) !important;
          border-color: #D9FF00 !important;
          box-shadow: 0 0 15px rgba(217,255,0,0.4) !important;
          color: white !important;
          outline: none !important;
        }

        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.08) inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>
    </div>
  )
}

export default Login
