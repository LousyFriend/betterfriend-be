// const bcrypt = require('bcryptjs');
const client = require('../client');
// import our seed data:
const contacts = require('../../data/contacts');

async function newUser(user) {
  return async (req, res) => {
    try {
      await contacts.map(({ name, job_title, image_url, interests, contact_category }) => {
        return client.query(`
                    INSERT INTO contacts (name, job_title, image_url, interests, contact_category, user_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [name, job_title, image_url, interests, contact_category, user.id]);
      });

  
    } catch (e) {

      res.status(500).json({ error: e.message });
    }

  };}
module.exports = { newUser };