import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ clipboardKey }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const fileUrl = response.data.fileUrl;
            setMessage(`File uploaded successfully: ${fileUrl}`);

            // Optionally save the file URL in the clipboard data
            await axios.post('/api/clipboard', {
                key: clipboardKey,
                files: [fileUrl],
            });
        } catch (error) {
            setMessage('Error uploading file.');
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Upload File</h3>
            <input type="file" onChange={onFileChange} className="form-control" />
            <button onClick={onUpload} className="btn btn-primary mt-2">Upload</button>
            <p>{message}</p>
        </div>
    );
};

export default FileUpload;
