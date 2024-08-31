import React, { useState, useEffect } from 'react';
import Clipboard from './components/Clipboard.js';
import FileUpload from './components/FileUpload.js';
const backendUrl = "https://klipbored.com";

function App() {
    const [clipboardKey, setClipboardKey] = useState('');
    const [fileUploadKey, fileUploadKeyKey] = useState('');

    // Track page load time
    useEffect(() => {
        const start = Date.now();
        
        const handleLoad = () => {
            const loadTime = Date.now() - start;
            console.log("Page load time:", loadTime);
            sendMetricToBackend('page_load_time_ms', loadTime);
        };

        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    // Track user interactions (example: clicks on components)
    const handleClipboardClick = () => {
        sendMetricToBackend('clipboard_clicks', 1);
    };

    const handleFileUploadClick = () => {
        sendMetricToBackend('file_upload_clicks', 1);
    };

    // Function to send metrics to backend
    const sendMetricToBackend = (event, value) => {
        fetch(`${backendUrl}/api/metrics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, value })
        }).catch(err => console.error('Error sending metric:', err));
    };
    

    return (
        <div className="App">
            <h1 style={{color:'white'}}>Klipbored</h1>
            <div onClick={handleClipboardClick}>
                <Clipboard clipboardKey={clipboardKey} />
            </div>
            <div onClick={handleFileUploadClick}>
                <FileUpload fileUploadKey={fileUploadKey} />
            </div>
        </div>
    );
}

export default App;
