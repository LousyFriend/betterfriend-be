const request = require('superagent');

function postCalendarEvent() {
  return async (req, res) => {
    
    try {
      const oauth = req.get('Oauth');
      
      const data = await request.post('https://www.googleapis.com/calendar/v3/calendars/primary/events').send(req.body).set('Authorization', `Bearer ${oauth}`);
  
      res.json(data.body);
    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { postCalendarEvent };