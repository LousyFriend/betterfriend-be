require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app newuser routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'bob@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    // tests new user
    test('tests new user success', async() => {

      const expectObj = [{
        'id': expect.any(Number),
        'name': expect.any(String),
        'job_title': expect.any(String),
        'image_url': expect.any(String),
        'interests': expect.any(String),
        'contact_category': expect.any(String),
        'next_date': null,
        'event_id': null,
        'user_id': 2
      }];

      const data = await fakeRequest(app)
        .post('/api/new-user')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body.newContactData).toEqual(expect.arrayContaining(expectObj));
      expect(data.body.newContactData[0].id).toEqual(data.body.newSocialMediaData[0].contact_id);
    });
  });
});