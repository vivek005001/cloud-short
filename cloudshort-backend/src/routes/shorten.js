const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { generateShortId } = require('../utils/shortid');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/', async (req, res) => {
    try {
        const { url, custom } = req.body;
        if (!url) return res.status(400).json({ error: "url is required" });

        let short;
        if (custom) {
            if(!/^[a-zA-Z0-9_-]{3,64}$/.test(custom)) return res.status(400).json({ error: "invalid custom alias" });
            const { data: exists } = await supabase.from('urls').select('id').eq('short', custom).single();
            if (exists) return res.status(400).json({ error: "alias already taken" });
            short = custom;
        } else {
            short = generateShortId(url, parseInt(process.env.SHORT_LENGTH || 6));
            let tries = 0;
            while (tries < 5) {
                const { data: exists } = await supabase.from('urls').select('id').eq('short', short).single();
                if (!exists) break;
                short = generateShortId(url + Date.now().toString() + tries, parseInt(process.env.SHORT_LENGTH || 6));
                tries++;
            }
        }

        await supabase.from('urls').insert({ short, target: url });

        // Call ML service
        let mlResult = {};
        try {
            const mlRes = await fetch(`${process.env.ML_SERVICE_URL}/check_url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            mlResult = await mlRes.json();
        } catch (e) {
            console.error("ML service error", e);
        }

        return res.json({ short, redirect_url: `${process.env.BASE_URL || ''}/r/${short}`, mlResult });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "server error" });
    }
});

module.exports = router;
