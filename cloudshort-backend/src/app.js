require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const shortenRoute = require('./routes/shorten');
const redirectRoute = require('./routes/redirect');
const analyticsRoute = require('./routes/analytics');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/shorten', shortenRoute);
app.use('/r', redirectRoute);
app.use('/analytics', analyticsRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
