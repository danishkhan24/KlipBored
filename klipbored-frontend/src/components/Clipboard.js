import React, { useState } from 'react';
import axios from 'axios';

const Clipboard = () => {
    const [data, setData] = useState('');
    const [message, setMessage] = useState('');
    const [clipboardData, setClipboardData] = useState(null);
    const [key, setKey] = useState('');


    const onSave = async () => {
        try {
            const response = await axios.post('/api/clipboard', { data, files: [] });
            setMessage('Clipboard data saved successfully!');
            setKey(response.data); // Set the key returned by the server
        } catch (error) {
            setMessage('Error saving clipboard data.');
            console.error(error);
        }
    };

    const onRetrieve = async () => {
        try {
            const response = await axios.get(`/api/clipboard/${key}`);
            setClipboardData(response.data);
            setMessage('Clipboard data retrieved successfully.');
        } catch (error) {
            setMessage('Error retrieving clipboard data.');
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Clipboard</h3>
            <input
                type="text"
                placeholder="Enter Your Unique Key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />
            <textarea
                placeholder="Enter clipboard data"
                value={data}
                onChange={(e) => setData(e.target.value)}
            ></textarea>        
            <button onClick={onSave}>Save</button>
            <button onClick={onRetrieve}>Retrieve</button>
            <p>{message}</p>
            {clipboardData && (
                <div>
                    <h4>Retrieved Data</h4>
                    <p>{clipboardData.data}</p>
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
