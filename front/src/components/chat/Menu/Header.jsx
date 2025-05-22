import React from 'react'
import { Box, styled } from '@mui/material';
import WhatsappIcon from '../../Icons/WhatsappIcon';
import NewChatIcon from '../../Icons/NewChatIcon';

import MoreMenu from './MoreMenu';

const Component = styled(Box)`
    display: flex;
    
    padding: 16px;
    justify-content: space-between;
    align-items: center;
`
const Component1 = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
`


const Header = () => {
    return (
        
        <Component>
            <WhatsappIcon />
            <Component1>
                <NewChatIcon />
                <MoreMenu/>
            </Component1>
        </Component>


    )
}

export default Header
