require('dotenv').config();
// const request = require('superagent');
const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'dan@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 60000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('should return an array containing the three seed data contacts', async() => {

      const expectation = {
        'id': expect.any(Number),
        'name': expect.any(String),
        'job_title': expect.any(String),
        'image_url': expect.any(String),
        'user_id': expect.any(Number),
        'linked_in':expect.any(String),
        'gmail':null,
        'phone':null,
      };
      await fakeRequest(app)
        .post('/api/new-user')
        .set('Authorization', token);
    
     

      const data = await fakeRequest(app)
        .get('/api/contacts')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
        
      expect(data.body[2]).toEqual(expectation);
    });
  });
});


// expect.arrayContaining(
