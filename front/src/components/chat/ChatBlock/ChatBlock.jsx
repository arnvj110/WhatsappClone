import { Box } from "@mui/material"
import styled from "styled-components"




import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import { useContext, useEffect, useState } from "react";


import { AccountContext } from "../../context/AccountProvider";
import { getConversation } from "../../../service/api";

const Component = styled(Box)`
    font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
`



const ChatBlock = () => {
    
    const { account, person } = useContext(AccountContext);
    const [conversation, setConversation] = useState({});
    useEffect(()=>{
        const getConversationDetails = async () => {
            let data = await getConversation({senderId:account.sub, receiverId:person.sub});
            setConversation(data);
        }
        getConversationDetails();
    },[person.sub]);

    return (
        <Component>

            <ChatHeader person={person} />
            <Messages conversation={conversation} />


        </Component>
    )
}

export default ChatBlock
