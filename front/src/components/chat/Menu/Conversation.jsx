import { Avatar, Box } from '@mui/material'
import { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'

import TimeStamp from '../../TimeStamp'
import { AccountContext } from '../../context/AccountProvider'
import { getConversation, setConversation } from '../../../service/api'

const Component = styled(Box)`
margin-left: 3px;
    width: 90%;
    border-radius: 10px;
    display: flex;
    gap:10px;
    padding: 10px;
    justify-content: space-between;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    &:hover {
    background-color:rgb(249, 244, 249);
  }
    cursor: pointer;
  overflow: hidden;
    
    
`

const Component1 = styled(Box)`
    display: flex;
    flex-direction: column;
    
    overflow:hidden;
    width: 82%;
    justify-content: center;
    gap: 5px;
    
`

const Component2 = styled(Box)`
    display: flex;
    font-weight: 500;
    font-size: 18px;
    justify-content: space-between;
    
`

const Component3 = styled(Box)`
    display: flex;
    color: #808080;
    font-size: 14px;
    
`

const Component4 = styled(Box)`
    color: #808080;
    font-size: 12px;
`

const Conversation = ({ user }) => {
  const [latestMessage, setLatestMessage] = useState({});
  const { account, setPerson, newMessageRender } = useContext(AccountContext);


  const getUser = async () => {
    setPerson(user);
    await setConversation({ senderId: account.sub, receiverId: user.sub });
  }

  useEffect(() => {
    const getConversationDetails = async () => {
      const data = await getConversation({
        senderId: account.sub,
        receiverId: user.sub
      });

      setLatestMessage({ text: data?.message, timestamp: data?.updatedAt });
    };

    getConversationDetails();

  }, [newMessageRender]);

  return (
    <Component onClick={() => {
      getUser();

    }} >
      <Avatar src={user.picture} sx={{ width: 55, height: 55 }} />
      <Component1>
        <Component2>
          {user.name}
          <Component4>
            <TimeStamp time={latestMessage.timestamp} />
          </Component4>


        </Component2>
        <Component3>
          {latestMessage?.text?.includes("/api/") ? 'media' : latestMessage.text} 
        </Component3>

      </Component1>
    </Component>
  )
}

export default Conversation
