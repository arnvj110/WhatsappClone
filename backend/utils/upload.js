// utils/upload.js
import multer from 'multer';
import { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential, SASProtocol } from '@azure/storage-blob';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

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

// --- Function to generate SAS URL for file access ---
export const generateSasUrl = (blobName) => {
    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(
            AZURE_STORAGE_ACCOUNT_NAME,
            AZURE_STORAGE_ACCOUNT_KEY
        );

        const sasOptions = {
            containerName: AZURE_CONTAINER_NAME,
            blobName: blobName,
            expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour expiry
            permissions: 'r', // Read permission
            protocol: SASProtocol.Https,
        };

        const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
        
        return `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${blobName}?${sasToken}`;
    } catch (error) {
        console.error("Error generating SAS URL:", error);
        throw error;
    }
};

// --- Middleware function to handle upload to Azure ---
export const uploadToAzure = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

        // Create a unique name for the blob
        const blobName = `${uuidv4()}-${req.file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload the file buffer to Azure
        await blockBlobClient.upload(req.file.buffer, req.file.size, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        // Generate SAS URL instead of public URL
        const sasUrl = generateSasUrl(blobName);

        // Attach the SAS URL to the request
        req.file.azureUrl = sasUrl;
        req.file.blobName = blobName;

        next();
    } catch (error) {
        console.error("Error uploading to Azure:", error);
        res.status(500).json({ message: "File upload to Azure failed." });
    }
};