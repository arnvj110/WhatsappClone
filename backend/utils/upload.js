// utils/upload.js
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import { generateSasUrl } from './azureHelpers.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

// --- Allowed MIME types and their extensions ---
const MIME_TO_EXT = {
  // Images
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/bmp': '.bmp',
  'image/tiff': '.tiff',
  // jfif is served as image/jpeg by browsers
  'image/jfif': '.jpg',

  // Documents
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'text/plain': '.txt',

  // Archives
  'application/zip': '.zip',
  'application/x-rar-compressed': '.rar',
  'application/x-7z-compressed': '.7z',
};

const ALLOWED_MIMES = Object.keys(MIME_TO_EXT);

// File size limits per type (in bytes)
const SIZE_LIMITS = {
  image: 5 * 1024 * 1024,   // 5MB for images
  document: 20 * 1024 * 1024, // 20MB for documents
  archive: 50 * 1024 * 1024,  // 50MB for archives
};

const getFileCategory = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('application/zip') || mimetype.includes('rar') || mimetype.includes('7z')) return 'archive';
  return 'document';
};

// --- File filter ---
const fileFilter = (req, file, cb) => {
  // Handle .jfif — browsers send it as image/jpeg, but originalname may end in .jfif
  // We accept it since mimetype will be image/jpeg
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}. Allowed: images, PDF, Word, Excel, PowerPoint, ZIP.`), false);
  }
};

// --- Multer with high limit (we enforce per-category limits manually) ---
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB ceiling — per-category check below
  },
});

// --- Azure upload middleware ---
export const uploadToAzure = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const { mimetype, size, originalname } = req.file;
  const category = getFileCategory(mimetype);

  // Per-category size check
  if (size > SIZE_LIMITS[category]) {
    const limitMB = SIZE_LIMITS[category] / (1024 * 1024);
    return res.status(400).json({
      message: `File too large. ${category} files must be under ${limitMB}MB.`,
    });
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

    // Derive extension from mimetype — fixes .jfif → .jpg
    const ext = MIME_TO_EXT[mimetype] || '.bin';
    const blobName = `${uuidv4()}${ext}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: mimetype,
        blobContentDisposition: `attachment; filename="${originalname}"`, // preserves original name on download
      },
    });

    req.file.azureUrl = generateSasUrl(blobName);
    req.file.blobName = blobName;
    req.file.originalName = originalname; // pass through for DB storage
    req.file.category = category;

    next();
  } catch (error) {
    console.error("Azure upload error:", error);
    return res.status(500).json({
      message: "File upload to Azure failed",
      error: error.message,
    });
  }
};