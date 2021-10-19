const client = require('../client.js');

function getContact() {
  return async (req, res) => {
    // This could be a function, taking req and res as arguements.
    try {
      const data = await client.query('SELECT * FROM contacts JOIN social_media ON contacts.id = social_media.contact_id WHERE contacts.id = $1', [req.params.contact_id]);
      
      res.json(data.rows);
    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { getContact };