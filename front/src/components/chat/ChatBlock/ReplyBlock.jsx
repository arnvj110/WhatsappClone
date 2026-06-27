import { Box, InputBase } from '@mui/material';
import StickerIcon from "../../Icons/StickerIcon";
import MicIcon from "../../Icons/MicIcon";
import SendIcon from '../../Icons/SendIcon';
import styled from 'styled-components';
import { useContext, useEffect, useRef, useState } from 'react';
import ReplyMore from '../../Icons/ReplyMore';
import MoreMenu from './MoreMenu';
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
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;
`;

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
        color: rgb(44, 44, 44);
        caret-color: #28b463;
    }

    & input::placeholder {
        color: #666666;
        opacity: 1;
        font-size: 14px;
    }
`;

const Box1 = styled(Box)`
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px;
    &:hover { background-color: #d1d7db; }
`;

const Box2 = styled(Box)`
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px;
    &:hover { background-color: #28b463; }
`;

const Box3 = styled(Box)`
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px;
    background-color: #28b463;
`;

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
    &:hover { background-color: #d1d7db; }
`;

// File preview bar shown when a file is selected but not yet sent
const FilePreviewBar = styled(Box)`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: #f0f2f5;
    border-radius: 8px;
    font-size: 13px;
    color: #555;
    width: 100%;
    margin-bottom: 4px;
`;

const ReplyBlock = ({
    sendText,
    setValue,
    value,
    file,
    setFile,
    setImage,
    onFileSelect,      // ← new: handles upload logic in Messages.jsx
    acceptedTypes,     // ← new: comma-separated accepted MIME types
    uploading,         // ← new: shows disabled state while uploading
}) => {
    const { person } = useContext(AccountContext);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
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
        if (inputRef.current) inputRef.current.focus();
    }, [person]);

    // When user picks a file — delegate to Messages.jsx handler
    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Reset input so same file can be re-selected if needed
        e.target.value = '';

        if (onFileSelect) {
            // New flow: Messages.jsx handles upload + validation
            onFileSelect(selectedFile);
            setValue(selectedFile.name); // show filename in input
        } else {
            // Fallback: old behaviour
            setFile(selectedFile);
            setValue(selectedFile.name);
        }
    };

    // Clear selected file
    const handleClearFile = () => {
        setFile('');
        setImage('');
        setValue('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSend = () => {
        if (uploading) return; // block send while uploading
        sendText();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const showSendButton = value.length > 0 || file;

    return (
        <Box sx={{ width: '95%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* File preview bar */}
            {file && (
                <FilePreviewBar>
                    <span>📎</span>
                    <span style={{
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', flex: 1
                    }}>
                        {typeof file === 'object' ? file.name : file}
                    </span>
                    {uploading
                        ? <span style={{ color: '#888', fontSize: 12 }}>Uploading...</span>
                        : <span
                            onClick={handleClearFile}
                            style={{ cursor: 'pointer', color: '#e53935', fontWeight: 700, fontSize: 16 }}
                            title="Remove file"
                          >✕</span>
                    }
                </FilePreviewBar>
            )}

            <ReplyDiv>
                <Box4 onClick={handleMenuClick} rotateBack={menuOpen}>
                    <ReplyMore sx={{ cursor: 'pointer' }} />
                </Box4>

                {/* Hidden file input — triggered by MoreMenu */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes || 'image/*'}
                    style={{ display: 'none' }}
                    onChange={onFileChange}
                    id="file-upload-input"
                />

                <MoreMenu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    onFileChange={onFileChange}  // still passed for MoreMenu's own input if it has one
                    fileInputId="file-upload-input"  // let MoreMenu trigger the hidden input
                />

                <Box1><StickerIcon /></Box1>

                <InputField
                    placeholder={uploading ? "Uploading file..." : "Type a message"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if ((e.keyCode || e.which) === 13 && !uploading) handleSend();
                    }}
                    inputRef={inputRef}
                    disabled={uploading}
                />

                {!showSendButton ? (
                    <Box2
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <MicIcon hover={hover} />
                    </Box2>
                ) : (
                    <Box3
                        onClick={handleSend}
                        sx={{ opacity: uploading ? 0.5 : 1 }}
                    >
                        <SendIcon />
                    </Box3>
                )}
            </ReplyDiv>
        </Box>
    );
};

export default ReplyBlock;