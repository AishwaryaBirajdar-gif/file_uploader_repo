const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// Multer setup: Temporary file storage and size limit
const upload = multer({
    dest: 'uploads/', // Directory for temporary file storage
    limits: { fileSize: 10 * 1024 * 1024 }, // Set max file size (10 MB)
});

// Configure MinIO (S3-compatible storage)
const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.MINIO_ENDPOINT), // Ensure the endpoint is correct
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
    s3ForcePathStyle: true, // Needed for MinIO
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

// File Upload API
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Read the uploaded file
        const fileContent = fs.readFileSync(req.file.path);

        // Create a unique key for the file in the bucket
        const fileKey = `${Date.now()}-${req.file.originalname}`;

        // S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileKey,
            Body: fileContent,
            ContentType: req.file.mimetype,
        };

        // Upload to S3 (MinIO)
        const data = await s3.upload(params).promise();

        // Cleanup the temporary file
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error cleaning up temporary file:', err);
            }
        });

        // Respond with success and the file URL
        res.status(200).json({
            message: 'File uploaded successfully!',
            url: data.Location,
        });
    } catch (error) {
        console.error('Upload Error:', error);

        // Cleanup the temporary file in case of an error
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error cleaning up temporary file:', err);
                }
            });
        }

        res.status(500).send('Failed to upload file.');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('File uploader is running on port 3000.');
});
