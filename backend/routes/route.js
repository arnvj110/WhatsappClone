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
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
import { generateSasUrl } from '../utils/azureHelpers.js';

dotenv.config();

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
route.get('/file/url/:blobName', getFileUrl);
route.get('/files/list', listFiles);
route.delete('/file/:blobName', deleteFileController);

// ✅ CORRECTED: Azure test route
route.get('/test-azure', async (req, res) => {
    try {
        const connectionString = process.env.AZURE_CONNECTION_STRING;
        const containerName = process.env.AZURE_CONTAINER_NAME;
        
        if (!connectionString || !containerName) {
            return res.status(400).json({ 
                error: "Azure credentials not configured in .env file",
                missing: {
                    connectionString: !connectionString ? 'AZURE_CONNECTION_STRING' : null,
                    containerName: !containerName ? 'AZURE_CONTAINER_NAME' : null
                }
            });
        }
        
        // Create container client properly
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        // Test connection by getting properties
        await containerClient.getProperties();
        
        res.json({ 
            message: "✅ Azure connected successfully!",
            container: containerName,
            account: process.env.AZURE_STORAGE_ACCOUNT_NAME || 'Not specified'
        });
    } catch (error) {
        console.error("Azure test error:", error);
        res.status(500).json({ 
            error: "Azure connection failed",
            details: error.message,
            code: error.code || 'Unknown error'
        });
    }
});

// ✅ Add health check route
route.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

route.get('/file/download/:blobName', async (req, res) => {
  try {
    const { blobName } = req.params;
    const sasUrl = generateSasUrl(decodeURIComponent(blobName));

    const response = await fetch(sasUrl);
    if (!response.ok) throw new Error(`Azure fetch failed: ${response.status}`);

    const buffer = await response.arrayBuffer();
    
    res.setHeader('Content-Disposition', `attachment; filename="${blobName}"`);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Download proxy error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default route;