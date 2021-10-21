const client = require('../client.js');

async function getContactCalendar(req, res) {

  try {
    const data = await client.query('SELECT event_id, next_date FROM contacts WHERE contacts.id = $1', [req.params.contact_id]);
      
    res.json(data.rows);
  } catch (e) {
  
    res.status(500).json({ error: e.message });
  }
}

module.exports = { getContactCalendar };