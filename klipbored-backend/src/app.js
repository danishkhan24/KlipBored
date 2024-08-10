require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const clipboardRoutes = require('./routes/clipboardRoutes');

// Middleware to parse JSON bodies
app.use(express.json());

// Use the clipboard routes
app.use('/api', clipboardRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to Klipbored!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    
});

