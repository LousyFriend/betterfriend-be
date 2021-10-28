const client = require('../client.js');

async function getComments(req, res) {
  // This could be a function, taking req and res as arguements.
  try {
    const data = await client.query('SELECT * FROM comments WHERE contact_id = $1', [req.params.contact_id]);
      
    res.json(data.rows);
  } catch (e) {
  
    res.status(500).json({ error: e.message });
  }
}

module.exports = { getComments };