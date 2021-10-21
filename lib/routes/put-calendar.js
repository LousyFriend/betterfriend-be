const request = require('superagent');

async function putCalendarEvent(req, res) {
    
  try {
    const oauth = req.get('Oauth');
      
    const data = await request.put(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${req.params.event_id}`).send(req.body).set('Authorization', `Bearer ${oauth}`);
  
    res.json(data.body);
  } catch (e) {
  
    res.status(500).json({ error: e.message });
  }
}

module.exports = { putCalendarEvent };