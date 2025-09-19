const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/:short', async (req, res) => {
  try {
    const short = req.params.short;
    const { data: urlData } = await supabase.from('urls').select('id,target,clicks').eq('short', short).single();
    if (!urlData) return res.status(404).json({ error: 'not found' });

    const { data: recentClicks } = await supabase.from('clicks')
      .select('*')
      .eq('url_id', urlData.id)
      .gte('timestamp', new Date(Date.now() - 24*60*60*1000).toISOString());

    const { data: topRef } = await supabase.from('clicks')
      .select('referrer, count(*)')
      .eq('url_id', urlData.id)
      .group('referrer')
      .order('count', { ascending: false })
      .limit(5);

    return res.json({
      short,
      target: urlData.target,
      totalClicks: urlData.clicks,
      recentClicks: recentClicks.length,
      topReferrers: topRef.map(r => ({ referrer: r.referrer || 'direct', count: r.count }))
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
