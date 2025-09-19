const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/:short', async (req, res) => {
    const { short } = req.params;
    try {
        const { data: urlData } = await supabase.from('urls').select('*').eq('short', short).single();
        if (!urlData) return res.status(404).json({ error: "URL not found" });

        const { data: clicks } = await supabase.from('clicks').select('*').eq('short', short);
        const totalClicks = clicks.length;
        const recentClicks = clicks.filter(c => new Date(c.timestamp) > new Date(Date.now() - 24*60*60*1000)).length;

        // Top referrers
        const refCount = {};
        clicks.forEach(c => {
            if(c.referrer) refCount[c.referrer] = (refCount[c.referrer] || 0) + 1;
        });
        const topReferrers = Object.entries(refCount)
                                  .sort((a,b) => b[1]-a[1])
                                  .slice(0,5)
                                  .map(([ref,count]) => ({ ref, count }));

        return res.json({ short, target: urlData.target, totalClicks, recentClicks, topReferrers });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "server error" });
    }
});

module.exports = router;
