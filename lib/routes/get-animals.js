const client = require('../client.js');

function getAnimals() {
  return async (req, res) => {
    // This could be a function, taking req and res as arguements.
    try {
      const data = await client.query('SELECT * from animals');
  
      res.json(data.rows);
    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { getAnimals };