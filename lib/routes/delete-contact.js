const client = require('../client.js');

function deleteContact() {
  return async (req, res) => {
    try {
      const data = await client.query('DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.Contact_id, req.userId]);
      
      res.json(data.rows);
    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { deleteContact };