const client = require('../client.js');

function postContact() {
  return async (req, res) => {
    try {
      // Makes post request to contacts table with incoming contact information and the verified users ID.
      const contactData = await client.query(`INSERT INTO contacts (name, job_title, image_url, interests, contact_category, user_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [req.body.name, req.body.job_title, req.body.image_url, req.body.interests, req.body.contact_category, req.userId]);

      // Grab the new contact id from the returning contactData.
      const newContactId = contactData.rows[0].id;

      // Makes a post request to social media table with incoming request information and the new contact ID.
      const socialMediaData = await client.query(`
          INSERT INTO social_media (contact_id, linked_in, facebook, gmail, phone, twitter, github, personal_site)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [newContactId, req.body.linked_in, req.body.facebook, req.body.gmail, req.body.phone, req.body.twitter, req.body.github, req.body.personal_site]);

      // Grabs returning data from each table request.
      const returningData = { 
        contactData: contactData.rows[0],
        socialMediaData: socialMediaData.rows[0]
      };

      // Respond with the returning data.
      res.json(returningData);

    } catch (e) {
  
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { postContact };