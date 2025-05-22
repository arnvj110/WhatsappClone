import mongoose from 'mongoose';
import grid from 'gridfs-stream';
import dotenv from 'dotenv';

dotenv.config();

const url = "https://whatsappclone-2.onrender.com";

let gridFsBucket,gfs;
const conn = mongoose.connection;
conn.once("open", () => {
    gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "fs"
    })
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
});

export const UploadFile = async (req, res) => {
    
    if(!req.file) {
        return res.status(404).json({message: "No file uploaded"});
    }

    const imageUrl = `${url}/api/file/${req.file.filename}`;

    return res.status(200).json({
        message: 'File Uploaded',
        data: {
            filename: req.file.filename,
            path: imageUrl
        }
    });
}

export const getImage = async(req, res) => {
    try{
        
        const file = await gfs.files.findOne({filename:req.params.filename});
        
        const readStream = gridFsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error){
        res.status(500).json(error.message);
    }
}