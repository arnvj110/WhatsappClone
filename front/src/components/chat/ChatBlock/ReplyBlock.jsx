import { Box, InputBase } from '@mui/material';

import StickerIcon from "../../Icons/StickerIcon";
import MicIcon from "../../Icons/MicIcon";
import SendIcon from '../../Icons/SendIcon';
import styled from 'styled-components';
import { useContext, useEffect, useRef, useState } from 'react';
import ReplyMore from '../../Icons/ReplyMore';

import MoreMenu from './MoreMenu';
import { UploadImage } from '../../../service/api';
import { AccountContext } from '../../context/AccountProvider';



const ReplyDiv = styled(Box)`
    margin-top: 5px;   
    margin-bottom: 10px;
    z-index: 1;
    box-shadow: 0px 8px 15px -4px rgba(0, 0, 0, 0.15); 
    display: flex;
    border-radius: 50px;
    width: 95%;
    padding: 5px;
    background-color: white;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;
`

const InputField = styled(InputBase)`

  width: 88%;

  font-size: 16px;
  
  padding-left: 10px;
  outline: none;

  & input {
    height: 20px;
    line-height: 40px;
    padding: 2px;
    letter-spacing: 0.5px;
    color:rgb(44, 44, 44);
    

    caret-color: #28b463;
  }

  & input::placeholder {
    color: #666666;
    opacity: 1;
    font-size: 14px;
  }

  &::selection{
    background-color:rgb(154, 247, 193);
    
    }
  
`;

const Box1 = styled(Box)`
    border-radius: 50%;
    cursor: pointer;
    
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px;
    
    &:hover {
        background-color: #d1d7db; 
    }

`

const Box2 = styled(Box)`
    border-radius: 50%;
    cursor: pointer;
    
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px;
    
    &:hover {
        background-color: #28b463; 
    }

    
`

const Box3 = styled(Box)`
    border-radius: 50%;
    cursor: pointer;
    
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px;
    
    
    background-color: #28b463; 
    
    
`

const Box4 = styled(Box).withConfig({
    shouldForwardProp: (prop) => prop !== 'rotateBack',
})`
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9px;
  transition: transform 0.3s ease-in-out;

  transform: ${({ rotateBack }) => rotateBack ? 'rotate(135deg)' : 'rotate(0deg)'};
  background-color: ${({ rotateBack }) => rotateBack ? '#d1d7db' : 'white'};

  &:hover {
    background-color: #d1d7db; 
  }
`;


const ReplyBlock = ({ sendText, setValue, value, file, setFile, setImage }) => {
    const { person } = useContext(AccountContext);
    const inputRef = useRef(null);
    const [hover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [person]);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
        setValue(e.target.files[0].name);
    }

    useEffect(() => {
        const getImage = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);

                const res = await UploadImage(data);

                setImage(res.data.data.path);
            }
        }
        getImage();
    }, [file]);


    return (
        <ReplyDiv>

            <Box4 onClick={handleMenuClick} rotateBack={menuOpen}>
                <ReplyMore sx={{ cursor: 'pointer' }} />
            </Box4>

            <MoreMenu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} onFileChange={onFileChange} />



            <Box1><StickerIcon /></Box1>

            <InputField
                placeholder="Type a message"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    const code = e.keyCode || e.which;
                    if (code === 13) {
                        sendText();
                    }
                }}
                inputRef={inputRef}
            />

            {value.length <= 0 ? (
                <Box2
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <MicIcon hover={hover} />
                </Box2>
            ) : (
                <Box3 onClick={sendText}>
                    <SendIcon />
                </Box3>
            )}
        </ReplyDiv>
    );
};

export default ReplyBlock;