import React, { useState } from 'react';
import Clipboard from './components/Clipboard.js';
import FileUpload from './components/FileUpload.js';

function App() {
    const [clipboardKey, setClipboardKey] = useState('');

    return (
        <div className="App">
            <h1 style={{color:'white'}}>Klipbored</h1>
            <Clipboard />
            <FileUpload clipboardKey={clipboardKey} />
        </div>
    );
}

export default App;
