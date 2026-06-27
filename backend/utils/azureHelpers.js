// utils/azureHelpers.js
import { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential, SASProtocol, BlobSASPermissions } from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

// Initialize blob service client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

// Generate SAS URL for a blob
export const generateSasUrl = (blobName, expiryMinutes = 60) => {
    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(
            AZURE_STORAGE_ACCOUNT_NAME,
            AZURE_STORAGE_ACCOUNT_KEY
        );

        const sasOptions = {
            containerName: AZURE_CONTAINER_NAME,
            blobName: blobName,
            expiresOn: new Date(new Date().valueOf() + expiryMinutes * 60 * 1000),
            permissions: BlobSASPermissions.parse('r'), // Read permission
            protocol: SASProtocol.Https,
        };

        const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
        
        return `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${blobName}?${sasToken}`;
    } catch (error) {
        console.error("Error generating SAS URL:", error);
        throw error;
    }
};

// Get all files in container (for admin purposes)
export const listAllFiles = async () => {
    try {
        const files = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            files.push({
                name: blob.name,
                uploaded: blob.properties.createdOn,
                size: blob.properties.contentLength,
                url: generateSasUrl(blob.name)
            });
        }
        return files;
    } catch (error) {
        console.error("Error listing files:", error);
        throw error;
    }
};

// Delete a file from Azure
export const deleteFile = async (blobName) => {
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.delete();
        return { success: true, message: "File deleted successfully" };
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};

export const getBlobServiceClient = () => {
  return BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
};