import React, { useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilSpeedometer,
  cilList
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

// const VerticallyCentered = () => {
//   const [visible, setVisible] = useState(false)
//   return (
//     <>
//       <CIcon icon={cilSettings} size="lg" onClick={() => setVisible(!visible)} />
//       <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
//         <CModalHeader>
//           <CModalTitle><CIcon icon={cilSettings} size="sm" />&nbsp;&nbsp;<strong>Settings</strong></CModalTitle>
//         </CModalHeader>
//         <CModalBody>
          
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setVisible(false)}>
//             Close
//           </CButton>
//           <CButton color="primary">Save changes</CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   )
// }

const AppHeaderDropdown = () => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CIcon icon={cilSettings} size="lg" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilList} className="me-2" />
          Lambda Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSpeedometer} className="me-2" />
          Calibate G-Force Meter
        </CDropdownItem>
      </CDropdownMenu>

      {/* <style jsx="true">{`
        .icon {
          vertical-align: middle;
        }
      `}</style> */}
    </CDropdown>
  )
}

export default AppHeaderDropdown
