const client = require('../client.js');

function putContact() {
  return async (req, res) => {
    try {
      // Makes PUT request to contacts table with incoming contact information and the verified users ID.
      const contactData = await client.query(`UPDATE contacts
                                              SET name = $1, job_title = $2, image_url = $3, interests = $4, contact_category = $5
                                              WHERE user_id = $6 AND id = $7
                                              RETURNING *`, [req.body.name, req.body.job_title, req.body.image_url, req.body.interests, req.body.contact_category, req.userId, req.params.contact_id]);

      // Makes a PUT request to social media table with incoming request information and the new contact ID.
      const socialMediaData = await client.query(`UPDATE social_media
                                                  SET linked_in = $1, facebook = $2, gmail = $3, phone = $4, twitter = $5, github = $6, personal_site = $7
                                                  WHERE contact_id = $8
                                                  RETURNING *`, [req.body.linked_in, req.body.facebook, req.body.gmail, req.body.phone, req.body.twitter, req.body.github, req.body.personal_site, req.params.contact_id]);

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

module.exports = { putContact };
