import { Box, styled } from '@mui/material'
import React, { useState } from 'react'

import SideMenu from './SideMenu'

import SettingsPage from './SettingsPage'
import ProfilePage from './ProfilePage'
import MainChatPage from './MainChatPage'

const Component = styled(Box)`
  height: 100%;
  overflow: hidden;
  display: flex;
  
  
`





const Menu = () => {
  
  const [selected, setSelected] = useState(0);
  
  return (
    <Component>
      <SideMenu setSelected={setSelected} />
      {selected === 0 && <MainChatPage/>}
      {selected === 4 && <SettingsPage/>}
      {selected === 5 && <ProfilePage/>}
      
    </Component>
  )
}

export default Menu
