// const bcrypt = require('bcryptjs');
const client = require('../client');
// import our seed data:
const contacts = require('../../data/contacts');
const social_media = require('../../data/social_media');

async function newUser(req, res)  {
  try {
    let contactArray = [];
    await Promise.all(contacts.map(async({ name, job_title, image_url, interests, contact_category }) => {
    //   console.log(name, job_title, image_url, interests, contact_category, req.userId);
      const data = await client.query(`
                    INSERT INTO contacts (name, job_title, image_url, interests, contact_category, user_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                `,
      [name, job_title, image_url, interests, contact_category, req.userId]);
      console.log(data.rows[0]);
      contactArray.push(data.rows[0]);
    }));
    
    // contactArray.map(({ id }) => id);
    
    await Promise.all(
      social_media.map(({ linked_in, facebook, gmail, phone, twitter, github, personal_site }, index) => {
        return client.query(`
                      INSERT INTO social_media (contact_id, linked_in, facebook, gmail, phone, twitter, github, personal_site)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                  `,
        [contactArray[index].id, linked_in, facebook, gmail, phone, twitter, github, personal_site]);
      })
    ); 
  
  } catch (e) {

    res.status(500).json({ error: e.message });
  }

}
module.exports = { newUser };