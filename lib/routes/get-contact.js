const client = require('../client.js');

function getContact() {
  return async (req, res) => {

    try {
      const data = await client.query('SELECT * FROM contacts JOIN social_media ON contacts.id = social_media.contact_id WHERE contacts.id = $1 AND contacts.user_id = $2', [req.params.contact_id, req.userId]);
      
      res.json(data.rows);
    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { getContact };