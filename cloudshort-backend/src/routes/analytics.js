const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET /analytics/:short
router.get('/:short', async (req, res) => {
  const shortId = req.params.short;

  try {
    // 1️⃣ Get the URL record from urls table
    const { data: urlData, error: urlError } = await supabase
      .from('urls')
      .select('*')
      .eq('short', shortId)
      .single();

    if (urlError || !urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // 2️⃣ Get all clicks for this URL
    const { data: clicksData, error: clicksError } = await supabase
      .from('clicks')
      .select('*')
      .eq('url_id', urlData.id);

    if (clicksError) {
      return res.status(500).json({ error: 'Server error' });
    }

    // 3️⃣ Calculate recent clicks (last 24h)
    const recentClicks = clicksData.filter(c => {
      const createdAt = new Date(c.created_at);
      const now = new Date();
      return (now - createdAt) / (1000 * 60 * 60 * 24) <= 1;
    }).length;

    // 4️⃣ Calculate top referrers
    const topReferrers = clicksData.reduce((acc, c) => {
      acc[c.referrer] = (acc[c.referrer] || 0) + 1;
      return acc;
    }, {});

    res.json({
      short: shortId,
      target: urlData.target,
      totalClicks: clicksData.length,
      recentClicks,
      topReferrers: Object.entries(topReferrers).map(([referrer, count]) => ({ referrer, count }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
