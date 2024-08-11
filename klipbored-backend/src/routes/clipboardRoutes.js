const express = require('express');
const router = express.Router();
const { saveClipboardData, getClipboardData } = require('../services/clipboardService');

router.post('/clipboard', async (req, res) => {
    const { data, files } = req.body;
    try {
        const key = await saveClipboardData(data, files);
        res.status(200).json(key); // send the generated key to user
    } catch (error) {
        res.status(500).send('Error saving clipboard data');
    }
});

router.get('/clipboard/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const data = await getClipboardData(key);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send('Clipboard not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving clipboard data');
    }
});

// Multer setup to handle file uploads
const multer = require('multer');
const upload = multer();
const { uploadFile } = require('../services/s3Service');

// File upload route
router.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    try {
        const result = await uploadFile(file.buffer, fileName, file.mimetype);
        res.status(200).json({ fileUrl: result.Location });
    } catch (error) {
        res.status(500).send('Error uploading file');
    }
});

module.exports = router;
