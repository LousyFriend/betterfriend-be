require('dotenv').config();

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
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line

      await fakeRequest(app)
        .post('/api/contacts/')
        .send({ name: 'John',
          job_title: 'SWD / SWE',
          image_url: '',
          interests: '',
          contact_category: 'personal',
          linked_in: '',
          facebook: '',
          gmail: '',
          phone: '',
          twitter: '',
          github: '',
          personal_site: ''
        })
        .set('Authorization', token)
        .expect('Content-Type', /json/);
     
    }, 30000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('contact calendar put request', async() => {

      const expectation = [{
        'id': expect.any(Number),
        'name': expect.any(String),
        'job_title': expect.any(String),
        'image_url': expect.any(String),
        'interests': expect.any(String),
        'contact_category': expect.any(String),
        'next_date': '20211023',
        'event_id': 'event123',
        'user_id': expect.any(Number),
      }];

      const data = await fakeRequest(app)
        .put('/api/contact/calendar/4')
        .send({ next_date: '20211023',
          event_id: 'event123' })
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('fake test', async() => {

      const expectation = [{
        next_date: '20211023',
        event_id: 'event123'
      }];

      const data = await fakeRequest(app)
        .get('/api/contact/calendar/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
