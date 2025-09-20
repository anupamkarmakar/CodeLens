const express = require('express');
const cors = require('cors');
const aiRoute = require('./routes/ai.routes');

const app = express();

// Enable CORS for all origins (in production, you'd want to restrict this)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.use('/ai', aiRoute);

module.exports = app;

