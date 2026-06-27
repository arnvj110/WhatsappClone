import { Menu, styled, IconButton } from '@mui/material';
import { useState } from 'react';
import DownloadIcon from '../../Icons/DownloadIcon';
import DropDownArrow from '../../Icons/DropDownArrow';
import { getDownloadUrl } from '../../context/api';

const Component = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  padding: '5px 10px',
  alignItems: 'center',
  width: '200px',
  height: '40px',
  borderRadius: '10px',
  cursor: 'pointer',
  margin: '5px 10px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  color: '#919191'
}));

const DownloadDrop = ({ fileUrl, onOpen, onClose }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    onOpen?.();
  };

 const handleDownload = (e, blobName) => {
  e.preventDefault();
  
  const downloadUrl = getDownloadUrl(blobName);  // backend proxy URL
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = downloadUrl;
  a.download = blobName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  handleClose();  // close the menu after download
};

  const handleClose = () => {
    setAnchorEl(null);
    onClose?.();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <DropDownArrow />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          onMouseEnter: onOpen,

          sx: {
            borderRadius: '15px',
            marginTop: '5px',
            padding: '5px 0',
          },
        }}
      >
        <Component onClick={(e)=>{handleDownload(e, fileUrl)}}>
          <DownloadIcon />
          Download
        </Component>
      </Menu>
    </>
  );
};

export default DownloadDrop;
