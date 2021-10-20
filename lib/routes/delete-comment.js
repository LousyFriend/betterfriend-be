const client = require('../client.js');

function deleteComment() {
  return async (req, res) => {
    try {
      const data = await client.query('DELETE FROM comments WHERE comment_id = $1 AND user_id = $2 RETURNING *', [req.userId, req.params.comment_id]);
      
      res.json(data.rows);
    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { deleteComment };