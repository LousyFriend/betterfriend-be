const client = require('../client.js');

function postComment() {
  return async (req, res) => {
    try {
      const data = await client.query(`INSERT INTO comments (comment, user_id, contact_id)
                                       VALUES($1, $2, $3)`, [req.body.comment, req.userId, req.params.contact_id]);
      
      res.json(data.rows);
    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { postComment };