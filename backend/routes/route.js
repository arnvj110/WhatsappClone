// routes/route.js
import express from 'express';
import { addUser, getUsers } from '../controllers/userController.js';
import { newConversation, getConversation } from '../controllers/conversationController.js';
import { addMessage, getMessages } from '../controllers/messageController.js';
import { 
    UploadFile, 
    getFileUrl, 
    listFiles, 
    deleteFileController 
} from '../controllers/fileController.js';
import { upload, uploadToAzure } from '../utils/upload.js';

const route = express.Router();

// User routes
route.post('/add', addUser);
route.get('/getUsers', getUsers);

// Conversation routes
route.post('/conversation/add', newConversation);
route.post('/conversation/get', getConversation);

// Message routes
route.post('/message/add', addMessage);
route.get('/message/get/:id', getMessages);

// File routes
route.post('/file/upload', upload.single("file"), uploadToAzure, UploadFile);
route.get('/file/url/:blobName', getFileUrl); // Get SAS URL for existing file
route.get('/files/list', listFiles); // Optional: List all files (admin)
route.delete('/file/:blobName', deleteFileController); // Optional: Delete file

export default route;