import React, { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Menu, MenuItem, styled } from '@mui/material';

const Component = styled(MenuItem)`
    margin: 0px 10px 0px 10px;
`


const MoreMenu = () => {
    const [open, setOpen] = useState(null);
    const openB = Boolean(open);

    const handleClose = () => {
        setOpen(false);
    };
    const handleClick = (e) => {
        setOpen(e.currentTarget);
    };

  return (
    <Box>
        <MoreVertIcon onClick={handleClick} sx={{cursor:'pointer'}}  />
        <Menu
        sx={{ padding: '20px' }}
        id="basic-menu"
        anchorEl={open}
        open={openB}
        onClose={handleClose}
        getcontentanchorel={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        autoFocus={false}
      >
        <Component onClick={handleClose}>New group</Component>
        <Component onClick={handleClose}>Starred messages</Component>
        <Component onClick={handleClose}>Select chats</Component>
        <Component onClick={handleClose}>Log out</Component>
      </Menu>
    </Box>
  )
}

export default MoreMenu
