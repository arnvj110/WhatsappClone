import { Avatar, Box, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDown from "../../Icons/ArrowDown";
import Camera from "../../Icons/Camera";
import styled from 'styled-components'
import { useContext } from 'react';
import { AccountContext } from '../../context/AccountProvider';

const Header = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff; /* Add background color */
    box-shadow: 0px 8px 15px -4px rgba(0, 0, 0, 0.1);
    padding: 5px;
    position: relative; /* Add position */
    z-index: 1; /* Add z-index */
`

const HeaderC1 = styled(Box)`
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 5px;
    width: 60%;
`

const HeaderC3 = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    
    
`

const HeaderC2 = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 25px;
    height: 100%;
    width: 150px;
`

const HeaderC4 = styled(Box)`
    display: flex;
    gap: 3px;
`

const ChatHeader = ({person}) => {
    const {activeUsers} = useContext(AccountContext);

  return (
    <Header>
                    <HeaderC1>
                        <Avatar src={person?.picture || 'Cap.png'} sx={{ width: 45, height: 45 }} />
                        <HeaderC3>
                            <Typography sx={{ fontSize: '15px' }}>{person?.name || 'John Doe' }</Typography>
                            
                            <Typography sx={{ fontSize: '12px', color: '#666666' }}>{activeUsers.find(user=>user.sub=== person.sub) ? 'Online' : 'Offline'}</Typography>
                        </HeaderC3>
    
                    </HeaderC1>
                    <HeaderC2>
                        <HeaderC4>
                            <Camera />
                            <ArrowDown />
                        </HeaderC4>
                        <SearchIcon />
                        <MoreVertIcon />
                    </HeaderC2>
                </Header>
  )
}

export default ChatHeader
