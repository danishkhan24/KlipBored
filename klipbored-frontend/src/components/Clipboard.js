import React, { useState } from 'react';
import axios from 'axios';
const backendUrl = "https://klipbored.com";

const Clipboard = () => {
    const [data, setData] = useState('');
    const [message, setMessage] = useState('');
    const [clipboardData, setClipboardData] = useState('');
    const [dataError, setDataError] = useState(false);
    const [keyError, setKeyError] = useState(false);
    const [key, setKey] = useState('');

    const notifyEmptyFields = (message) => {
        setMessage(message);
    };

    const onSave = async () => {
        if (!data) {
            notifyEmptyFields("!! Text Field Can Not Be Empty !!");
            setDataError(true); 
            return; // Exit early if any fields are empty
        } else setDataError(false);

        try {
            const response = await axios.post(`${backendUrl}/api/clipboard`, { data, files: [] });
            setMessage('Clipboard data saved! Copy Your Key Above');
            setKey(response.data); // Set the key returned by the server
            setData(''); // Empty the input data textbox
            setClipboardData('');
        } catch (error) {
            setMessage('Error saving clipboard data.');
            console.error(error);
        }
    };

    const onRetrieve = async () => {
        if (!key) {
            notifyEmptyFields("!! Key Required to Fetch Clipboard Data !!");
            setKeyError(true); 
            return; // Exit early if any fields are empty
        } else setKeyError(false);

        try {
            const response = await axios.get(`${backendUrl}/api/clipboard/${key}`);
            setClipboardData(response.data);
            setMessage('Clipboard data retrieved successfully.');
        } catch (error) {
            setMessage('Error retrieving clipboard data.');
            console.error(error);
        }
    };

    const styles = {
        button: {
          padding: '10px 20px',
          backgroundColor: '#FF9800', /* Light orange */
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          fontSize: '16px',
          transition: 'background-color 0.3s ease', /* Smooth transition */
        },
        inputError: {
            border: '2px solid red', /* Red border for error */
        },
        inputNormal: {
            border: '1px solid #ccc', /* Normal border */
        },
    };

    const copyToClipboard = () => {
        if (clipboardData && clipboardData.data) {
            navigator.clipboard.writeText(clipboardData.data)
                .then(() => setMessage('Data copied to clipboard!'))
                .catch(() => setMessage('Failed to copy data.'));
        }
    };

    const openPrometheus = () => {
        // Replace with your Prometheus URL
        const prometheusUrl = `${backendUrl}/prometheus`;
        window.open(prometheusUrl, "_blank");
    };

    return (
        <div className="container">
            <h3>Clipboard</h3>
            <input
                type="text"
                style={keyError ? styles.inputError : styles.keyInput}
                placeholder="Enter Your Unique Key to fetch stored data"
                maxLength={4}
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />
            <textarea
                placeholder="Enter text to save in clipboard [max: 2000 characters]"
                style={dataError ? styles.inputError : styles.inputNormal}
                value={data}
                onChange={(e) => setData(e.target.value)}
            ></textarea>
            <div style={{ display: 'grid', gap: '5px' }}>
                <button onClick={onSave} className="btn btn-primary">Save</button>
                <button onClick={onRetrieve} className="btn btn-secondary">Retrieve</button>
                <button onClick={openPrometheus} className="btn" style={styles.button}>Prometheus</button>
                <p style={dataError || keyError ? styles.inputError : styles.inputNormal} >{message}</p>
            </div>
            {clipboardData && (
                <div className="mt-4">
                    <h4>Retrieved Data</h4>
                    <button onClick={copyToClipboard} className="btn btn-primary">Copy to Clipboard</button>
                    <textarea
                        readOnly
                        value={clipboardData.data}
                        style={{ width: '100%', height: '100px', marginTop: '5px', resize: 'none' }} // Styling for the textarea
                    ></textarea>
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
