import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import { getUsers } from "../../../service/api";
import Conversation from "./Conversation";
import { AccountContext } from "../../context/AccountProvider";

const Component = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  padding: 5px;
  margin-top: 20px;

  &::-webkit-scrollbar {
    width: 8px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #c1c1c1;

    &:hover {
      background-color: #a8a8a8;
    }
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
`;

const Box1 = styled(Box)`
  font-size: 14px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666666;
`

const Connections = ({ value }) => {
  const [data, setData] = useState([]);
  const { account, socket, setActiveUsers } = useContext(AccountContext);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await getUsers();
      if (res?.status === 200) {
        setData(res.data);
      }
    };
    fetchData();
  }, []);

  useEffect(()=>{
    socket.current.emit("addUsers", account);
    socket.current.on("getUsers", users=>{
      setActiveUsers(users);
    })
  }, [account]);

  const filteredUsers = value.length
    ? data.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      )
    : data;

  return (
    <Component>
      {filteredUsers.length == 0 && <Box1>No chats, contacts or messages found</Box1>}
      {filteredUsers.map((user, i) => {
        if (user.sub === account.sub) return null;
        return <Conversation key={i} user={user} />;
      })}
    </Component>
  );
};

export default Connections;
