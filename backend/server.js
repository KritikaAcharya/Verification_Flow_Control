const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// POST endpoint to verify code
app.post('/verify', (req, res) => {
    const { code } = req.body;

    // Check if code is 6 digits long and does not end with 7
    if (!/^\d{6}$/.test(code) || code[5] === '7') {
        return res.status(400).json({ error: 'Verification Error' });
    }

    res.status(200).json({ message: 'Verification successful' });
});

// Start server on port 4000
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
