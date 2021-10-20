const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const contacts = require('./contacts.js');
const social_media = require('./social_media.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        const hash = bcrypt.hashSync(user.password, 8);
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      contacts.map(({ name, job_title, image_url, interests, contact_category }) => {
        return client.query(`
                    INSERT INTO contacts (name, job_title, image_url, interests, contact_category, user_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [name, job_title, image_url, interests, contact_category, user.id]);
      })
    );

    await Promise.all(
      social_media.map(({ contact_id, linked_in, facebook, gmail, phone, twitter, github, personal_site }) => {
        return client.query(`
                    INSERT INTO social_media (contact_id, linked_in, facebook, gmail, phone, twitter, github, personal_site)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                `,
        [contact_id, linked_in, facebook, gmail, phone, twitter, github, personal_site]);
      })
    ); 

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}

module.exports = { run };

