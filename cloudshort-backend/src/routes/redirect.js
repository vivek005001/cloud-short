const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/:short', async (req, res) => {
  try {
    const short = req.params.short;
    const { data: urlData, error } = await supabase.from('urls').select('id, target, clicks').eq('short', short).single();
    if (error || !urlData) return res.status(404).send("Not found");

    // log click
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    const ua = req.headers['user-agent'] || '';
    const ref = req.headers['referer'] || req.headers['referrer'] || '';

    await supabase.from('clicks').insert({ url_id: urlData.id, ip, user_agent: ua, referrer: ref });
    await supabase.from('urls').update({ clicks: urlData.clicks + 1 }).eq('id', urlData.id);

    return res.redirect(urlData.target);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
