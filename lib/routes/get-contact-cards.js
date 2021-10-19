const client = require('../client.js');


function getContactCards() {
  return async (req, res) => {
    // This could be a function, taking req and res as arguements.
    try {
      const data = await client.query('SELECT contacts.name, contacts.job_title, contacts.image_url, social_media.gmail, social_media.phone, social_media.linked_in FROM contacts INNER JOIN social_media ON contacts.id = social_media.contact_id');
  
      res.json(data.rows);
    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { getContactCards };