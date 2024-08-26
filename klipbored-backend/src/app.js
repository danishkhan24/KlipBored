require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const clipboardRoutes = require('./routes/clipboardRoutes');
const cors = require('cors');

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the clipboard routes
app.use('/api', clipboardRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to Klipbored!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    
});
