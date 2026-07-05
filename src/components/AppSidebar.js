import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// import { logo } from 'src/assets/brand/logo'
// import { sygnet } from 'src/assets/brand/sygnet'

import logo from 'src/assets/images/ptracing-icon-light.png'
import sygnet from 'src/assets/images/pt-logo-sm.png'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <img src={logo} alt="Logo" className="sidebar-brand-full" height={32} />
          <img src={sygnet} alt="Sygnet" className="sidebar-brand-narrow" height={32} />

          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-flex flex-column justify-content-end align-items-stretch p-0" style={{ minHeight: 80 }}>
        <div className="w-100 d-flex justify-content-center align-items-center" style={{ borderTop: '2px solid #ff3333', height: 60 }}>
          <button
            style={{
              width: '90%',
              height: 40,
              background: '#ca2f2f',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              letterSpacing: 1
            }}
            onClick={() => {
              localStorage.removeItem('pttoken');
              window.location.href = '/#/login';
            }}
          >
            Logout
          </button>
        </div>
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
