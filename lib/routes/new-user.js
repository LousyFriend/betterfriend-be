// const bcrypt = require('bcryptjs');
const client = require('../client');
// import our seed data:
const contacts = require('../../data/contacts');
const social_media = require('../../data/social_media');

async function newUser(req, res)  {
  try {
    const contactData = await Promise.all(contacts.map(async({ name, job_title, image_url, interests, contact_category }) => {
    //   console.log(name, job_title, image_url, interests, contact_category, req.userId);
      return await client.query(`
                    INSERT INTO contacts (name, job_title, image_url, interests, contact_category, user_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                `,
      [name, job_title, image_url, interests, contact_category, req.userId]);
    }));
    
    const socialMediaData = await Promise.all(
      social_media.map(({ linked_in, facebook, gmail, phone, twitter, github, personal_site }, index) => {
        return client.query(`
                      INSERT INTO social_media (contact_id, linked_in, facebook, gmail, phone, twitter, github, personal_site)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
                  `,
        [contactData[index].rows[0].id, linked_in, facebook, gmail, phone, twitter, github, personal_site]);
      })
    );
    
    const mungedContactData = contactData.map(item => item.rows[0]);
    const mungedSocialMediaData = socialMediaData.map(item => item.rows[0]);
      
    res.json({
      newContactData: mungedContactData,
      newSocialMediaData: mungedSocialMediaData
    });

  } catch (e) {

    res.status(500).json({ error: e.message });
  }

}
module.exports = { newUser };