import React, { useState } from 'react';
import axios from 'axios';
const backendUrl = "https://klipbored.com";

const Clipboard = () => {
    const [data, setData] = useState('');
    const [message, setMessage] = useState('');
    const [clipboardData, setClipboardData] = useState(null);
    const [key, setKey] = useState('');

    const onSave = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/clipboard`, { data, files: [] });
            setMessage('Clipboard data saved successfully!');
            setKey(response.data); // Set the key returned by the server
            setData(''); // Empty the input data textbox
        } catch (error) {
            setMessage('Error saving clipboard data.');
            console.error(error);
        }
    };

    const onRetrieve = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/clipboard/${key}`);
            setClipboardData(response.data);
            setMessage('Clipboard data retrieved successfully.');
        } catch (error) {
            setMessage('Error retrieving clipboard data.');
            console.error(error);
        }
    };

    return (
        <div className="container">
            <h3>Clipboard</h3>
            <input
                type="text"
                placeholder="Enter Your Unique Key to fetch stored data"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="form-control"
            />
            <textarea
                placeholder="Enter clipboard data to store"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="form-control"
            ></textarea>
            <button
                onClick={onSave}
                className="btn btn-primary button-group"
            >
                Save
            </button>
            <button
                onClick={onRetrieve}
                className="btn btn-secondary button-group"
            >
                Retrieve
            </button>
            <p>{message}</p>
            {clipboardData && (
                <div className="mt-4">
                    <h4>Retrieved Data</h4>
                    <p style={{ fontSize: '18px' }}>{clipboardData.data}</p>
                    {clipboardData.files && clipboardData.files.length > 0 && (
                        <div>
                            <h5>Files:</h5>
                            <ul>
                                {clipboardData.files.map((file, index) => (
                                    <li key={index}>
                                        <a href={file} target="_blank" rel="noopener noreferrer">
                                            {file}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );    
};

export default Clipboard;
