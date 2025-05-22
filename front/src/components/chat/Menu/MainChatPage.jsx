

import Header from './Header'
import Search from './Search'
import styled from 'styled-components'
import { Box } from '@mui/material'
import Connections from './Connections'
import { useEffect, useState } from 'react'


const Component1 = styled(Box)`
  display: flex;
  flex-direction: column;
  
  overflow: hidden;
  width: 100%;
  
`

const MainChatPage = () => {
    const [value, setValue] = useState('');
    useEffect(()=>{
        
    },[value]);
    return (
        <Component1>
            <Header />
            <Search placeholder={'Search or start a new chat'} autoFocus={false} setValue={setValue} />
            <Connections value={value} />
        </Component1>
    )
}

export default MainChatPage
