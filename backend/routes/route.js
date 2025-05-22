import express from 'express';
import { addUser, getUsers } from '../controllers/userController.js';
import { newConversation, getConversation } from '../controllers/conversationController.js';
import { addMessage, getMessages } from '../controllers/messageController.js';
import { getImage, UploadFile } from '../controllers/fileController.js';
import { upload } from '../utils/upload.js';


const route = express.Router();

route.post('/add', addUser);
route.get('/getUsers', getUsers);

route.post('/conversation/add', newConversation);
route.post('/conversation/get', getConversation);

route.post('/message/add', addMessage);
route.get('/message/get/:id', getMessages);

route.post('/file/upload', upload.single("file"),  UploadFile);

route.get('/file/:filename', getImage);



export default route;