import { Menu, MenuItem, styled } from '@mui/material';
import Document from '../../Icons/Document';
import Photos from '../../Icons/Photos';
import Camera from '../../Icons/Camera';
import Poll from '../../Icons/Poll';
import Event from '../../Icons/Event';
import Sticker from '../../Icons/Sticker';
import Contact from '../../Icons/Contact';

const Component = styled(MenuItem)`
  margin: 0px 10px;
  
  display: flex;
  gap: 10px;
  padding: 5px;
  width: 200px;
  margin-top: 5px;
  border-radius: 10px;
  cursor:pointer;
  height: 40px;
`;

const MoreMenu = ({ anchorEl, open, onClose, onFileChange }) => {

    

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          borderRadius: '15px',
          marginTop: '-70px',
          padding: '10px 0',
          
        },
      }}
    >
        <label htmlFor="fileInput">
      <Component >
        
        <Document /> Document
        
        
        </Component>
        </label>
        <input type="file" id="fileInput" style={{display:'none'}} 
        onChange={(e)=>onFileChange(e)}
        />
      <Component onClick={onClose}> <Photos/> Photos & videos</Component>
      <Component onClick={onClose}> <Camera/> Camera</Component>
      <Component onClick={onClose}> <Contact/> Contacts</Component>
      <Component onClick={onClose}> <Poll/> Poll</Component>
      <Component onClick={onClose}> <Event/> Event</Component>
      <Component onClick={onClose}> <Sticker/> New sticker</Component>

    </Menu>
  );
};

export default MoreMenu;
