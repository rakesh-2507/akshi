const pool = require('../utils/db');

exports.addSteps = async (req, res) => {
  const { userId, steps } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  try {
    await pool.query(
      `INSERT INTO step_activity (user_id, date, steps)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, date)
       DO UPDATE SET steps = step_activity.steps + $3, updated_at = NOW()`,
      [userId, today, steps]
    );
    res.status(200).json({ message: 'Steps updated' });
  } catch (err) {
    console.error('❌ Error saving steps:', err);
    res.status(500).json({ error: 'Failed to save steps' });
  }
};

exports.getWeeklySteps = async (req, res) => {
  const userId = req.params.userId;
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 6);

  try {
    const result = await pool.query(
      `SELECT date, steps FROM step_activity
       WHERE user_id = $1 AND date BETWEEN $2 AND $3
       ORDER BY date ASC`,
      [userId, start.toISOString().slice(0, 10), today.toISOString().slice(0, 10)]
    );

    const map = {};
    result.rows.forEach(r => {
      map[r.date] = r.steps;
    });

    const weeklySteps = Array(7).fill(0).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return map[d.toISOString().slice(0, 10)] || 0;
    });

    res.json({ weeklySteps });
  } catch (err) {
    console.error('❌ Weekly error:', err);
    res.status(500).json({ error: 'Failed to fetch weekly steps' });
  }
};

exports.getLeaderboard = async (req, res) => {
  const { userId } = req.query; // fetch current user ID from query param

  try {
    const topUsers = await pool.query(`
  SELECT 
    u.id, 
    u.name, 
    u.profile_photo_url, 
    u.flat_number,               -- ✅ Add this line
    COALESCE(SUM(s.steps), 0) AS total_steps
  FROM users u
  LEFT JOIN step_activity s 
    ON u.id = s.user_id AND s.date >= CURRENT_DATE - INTERVAL '6 days'
  GROUP BY u.id
  ORDER BY total_steps DESC
  LIMIT 10
`);

    // Fetch current user’s rank separately
    let currentUser = null;
    if (userId) {
      const rankRes = await pool.query(`
        SELECT user_id, SUM(steps) AS total_steps,
        RANK() OVER (ORDER BY SUM(steps) DESC) AS rank
        FROM step_activity
        WHERE date >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY user_id
      `);

      const myRank = rankRes.rows.find(row => row.user_id === parseInt(userId));
      if (myRank) {
        const userRes = await pool.query(`SELECT id, name, profile_photo_url, flat_number FROM users WHERE id = $1`, [userId]);
        currentUser = {
          id: userRes.rows[0].id,
          name: userRes.rows[0].name,
          profile_photo_url: userRes.rows[0].profile_photo_url,
          flat_number: userRes.rows[0].flat_number,
          total_steps: myRank.total_steps,
          rank: myRank.rank,
        };
      }
    }

    res.json({
      leaderboard: topUsers.rows,
      currentUser,
    });
  } catch (err) {
    console.error('❌ Leaderboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
