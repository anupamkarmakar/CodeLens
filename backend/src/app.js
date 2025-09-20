const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const aiRoute = require('./routes/ai.routes');
const authRoute = require('./routes/auth.routes');

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.use('/ai', aiRoute);
app.use('/auth', authRoute);

module.exports = app;

