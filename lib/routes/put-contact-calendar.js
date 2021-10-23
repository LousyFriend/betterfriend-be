const client = require('../client.js');

async function updateContactCalendar(req, res) {
  
  try {
    const data = await client.query('UPDATE contacts SET event_id=$1, next_date=$2 WHERE id = $3 RETURNING *', [req.body.event_id, req.body.next_date, req.params.contact_id]);
      
    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
}

module.exports = { updateContactCalendar };