const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           
                CREATE TABLE contacts (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    job_title VARCHAR(512) NOT NULL,
                    image_url VARCHAR(512),
                    interests VARCHAR(512),
                    contact_category VARCHAR(512) NOT NULL,
                    next_date VARCHAR(512),
                    event_id VARCHAR(512) 
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                );
                CREATE TABLE social_media (
                  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
                  linked_in VARCHAR(512),
                  facebook VARCHAR(512),
                  gmail VARCHAR(512),
                  phone VARCHAR(512),
                  twitter VARCHAR(512),
                  github VARCHAR(512),
                  personal_site VARCHAR(512)
                );
                CREATE TABLE comments (
                  comment_id SERIAL PRIMARY KEY NOT NULL,
                  comment TEXT,
                  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE
                );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
