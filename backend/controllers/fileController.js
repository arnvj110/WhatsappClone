// controllers/fileController.js
import { generateSasUrl } from '../utils/azureHelpers.js';

export const UploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // The SAS URL is already generated in the uploadToAzure middleware
        const imageUrl = req.file.azureUrl;

        return res.status(200).json({
            message: 'File uploaded successfully',
            data: {
                filename: req.file.originalname,
                path: imageUrl,
                blobName: req.file.blobName,
                mimetype: req.file.mimetype,
                size: req.file.size,
                expiresIn: '1 hour' // SAS token expiry
            }
        });

    } catch (error) {
        console.error("Error in UploadFile:", error);
        res.status(500).json({ message: error.message });
    }
};

// Add new endpoint to get SAS URL for an existing file
export const getFileUrl = async (req, res) => {
    try {
        const { blobName } = req.params;
        
        if (!blobName) {
            return res.status(400).json({ message: "blobName is required" });
        }

        // Generate new SAS URL (valid for 1 hour)
        const sasUrl = generateSasUrl(blobName);

        return res.status(200).json({
            message: "SAS URL generated successfully",
            data: {
                url: sasUrl,
                expiresIn: '1 hour'
            }
        });

    } catch (error) {
        console.error("Error in getFileUrl:", error);
        res.status(500).json({ message: error.message });
    }
};

// Optional: Endpoint to list all files (admin)
export const listFiles = async (req, res) => {
    try {
        const files = await listAllFiles();
        return res.status(200).json({
            message: "Files retrieved successfully",
            data: files
        });
    } catch (error) {
        console.error("Error in listFiles:", error);
        res.status(500).json({ message: error.message });
    }
};

// Optional: Endpoint to delete a file
export const deleteFileController = async (req, res) => {
    try {
        const { blobName } = req.params;
        
        if (!blobName) {
            return res.status(400).json({ message: "blobName is required" });
        }

        const result = await deleteFile(blobName);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in deleteFileController:", error);
        res.status(500).json({ message: error.message });
    }
};