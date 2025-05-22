import { Box, Dialog, styled } from '@mui/material'

import Menu from './Menu/Menu'

import DownloadChat from './ChatBlock/DownloadChat';
import ChatBlock from './ChatBlock/ChatBlock';
import { useContext, useState } from 'react';
import { AccountContext } from '../context/AccountProvider';



const dialogStyle = {
    height: {
        xs: '100%',
        md: '95%'
    },
    margin: {
        xs: 0,
        md: '20px'
    },
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: '0 1px 15px rgba(32, 33, 36, 0.28)',
    border: 'none',
    borderRadius: 0,
};


const Component = styled(Box)`
    
    height: 100%;
    display: flex;
`
const MenuComponent = styled(Box)`
    height: 100%;
    min-width: 350px;
    width: 34%;
    
`

const ChatComponent = styled(Box)`
    border-left: 1px solid #e0e0e0;
    
    overflow: hidden;
    height: 100%;;
    min-width: 400px;
    width: 66%;
`

const ChatDialogue = () => {
    const { person } = useContext(AccountContext);
    
    return (
        <Dialog
            open={true}
            maxWidth={false}
            PaperProps={{ sx: dialogStyle }}
            hideBackdrop={true}
        >
            <Component>
                <MenuComponent>
                    <Menu />
                </MenuComponent>

                <ChatComponent>
                    
                    { Object.keys(person).length ? <ChatBlock /> : <DownloadChat /> }
                    
                </ChatComponent>
            </Component>

        </Dialog>
    )
}

export default ChatDialogue
