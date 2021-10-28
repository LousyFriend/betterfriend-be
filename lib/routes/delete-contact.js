const client = require('../client.js');

async function deleteContact(req, res) {
  try {
    const data = await client.query('DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.contact_id, req.userId]);
      
    res.json(data.rows);
  } catch (e) {
  
    res.status(500).json({ error: e.message });
  }
}

module.exports = { deleteContact };