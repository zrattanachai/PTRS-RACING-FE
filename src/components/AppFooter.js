import React from 'react'
import { CFooter } from '@coreui/react'
import logo from 'src/assets/images/pt-maxnitron-x-s63-logo.png'
import logo2 from 'src/assets/images/embeb-schematic-logo.png'

const AppFooter = () => {
  return (
    <CFooter className="px-4 mt-4 opacity-25">
      {/* <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a>
        <span className="ms-1">&copy; 2024 creativeLabs.</span>
      </div> */}
      <div className="ms-auto">
        <span className="me-3">Powered by</span>
        {/* <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI React Admin &amp; Dashboard Template
        </a> */}

        <img src={logo} alt="Logo" style={{ height: '30px', marginRight: '5px' }} />
        <img src={logo2} alt="Logo2" style={{ height: '30px', marginRight: '5px' }} />
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
