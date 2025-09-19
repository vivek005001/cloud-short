require('dotenv').config();
const express = require('express');
const cors = require('cors');

const shortenRoute = require('./routes/shorten');
const analyticsRoute = require('./routes/analytics');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/shorten', shortenRoute);
app.use('/analytics', analyticsRoute);

// Redirect endpoint
app.get('/r/:short', async (req, res) => {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { short } = req.params;
    const { data } = await supabase.from('urls').select('*').eq('short', short).single();
    if (!data) return res.status(404).send("URL not found");

    // Record click
    await supabase.from('clicks').insert({ short, timestamp: new Date().toISOString(), referrer: req.get('Referrer') || '' });

    return res.redirect(data.target);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
