import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

let _nav;
let pttoken = localStorage.getItem('pt-token') || localStorage.getItem('pttoken')
if (!pttoken) {
  window.location.href = '/#/login'
}

const decodeJwtPayload = (token) => {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    )
    return JSON.parse(decoded)
  } catch (error) {
    return null
  }
}

let payload = pttoken ? decodeJwtPayload(pttoken) : null
let isExpired = payload?.exp ? Date.now() / 1000 >= payload.exp : true
if (!payload || isExpired) {
  localStorage.removeItem('pttoken')
  window.location.href = '/#/login'
}

let role = payload?.role || 'driver';
console.log("User role:", role)
if (role == "admin") {
  _nav = [
    {
      component: CNavTitle,
      name: `Director Zone`,
    },
    {
      component: CNavGroup,
      name: 'Director Dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Truck 1-10',
          to: '/dashboard',
        },
        {
          component: CNavItem,
          name: 'Truck 11-20',
          to: '/dashboard2',
        },
        {
          component: CNavItem,
          name: 'Truck 21-30',
          to: '/dashboard3',
        },
        {
          component: CNavItem,
          name: 'Truck 31-40',
          to: '/dashboard4',
        },
        {
          component: CNavItem,
          name: 'Truck 41-50',
          to: '/dashboard5',
        },
      ],
    },
    {
      component: CNavTitle,
      name: 'Live Stream Zone',
    },
    {
      component: CNavGroup,
      name: 'Live Stream Dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Truck 1-8',
          to: '/live-dashboard1',
        },
        {
          component: CNavItem,
          name: 'Truck 9-16',
          to: '/live-dashboard2',
        },
        {
          component: CNavItem,
          name: 'Truck 17-24',
          to: '/live-dashboard3',
        },
        {
          component: CNavItem,
          name: 'Truck 25-32',
          to: '/live-dashboard4',
        },
        {
          component: CNavItem,
          name: 'Truck 33-40',
          to: '/live-dashboard5',
        },
      ],
    },
    {
      component: CNavTitle,
      name: `Driver Zone`,
    },
    {
      component: CNavItem,
      name: 'Driver Dashboard',
      to: '/driver',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    }
  ]
} else {
  _nav = [
    {
      component: CNavTitle,
      name: `Driver Zone`,
    },
    {
      component: CNavItem,
      name: 'Driver Dashboard',
      to: '/driver',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    }
  ]
}

export default _nav
