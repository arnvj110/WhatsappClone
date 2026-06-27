// utils/upload.js
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import { generateSasUrl } from './azureHelpers.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

dotenv.config();

const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

// --- In-memory storage engine for multer ---
const storage = multer.memoryStorage();

// --- File filter ---
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// --- Middleware function to handle upload to Azure ---
export const uploadToAzure = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

        // Preserve original extension, use UUID for uniqueness
        const ext = path.extname(req.file.originalname);
        const blobName = `${uuidv4()}${ext}`;

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload the file buffer to Azure
        await blockBlobClient.uploadData(req.file.buffer, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        // Use generateSasUrl from azureHelpers (single source of truth)
        req.file.azureUrl = generateSasUrl(blobName);
        req.file.blobName = blobName;
        console.log("🔍 mimetype:", req.file.mimetype, "→ ext:", ext, "→ blobName:", blobName);

        next();
    } catch (error) {
        console.error("Azure upload error:", error);
        return res.status(500).json({ 
            message: "File upload failed", 
            error: error.message 
        });
    }
};