require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app comment routes', () => {
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
    }, 30000);
  
    afterAll(done => {
      return client.end(done);
    });

    // POST
    test('post contact', async() => {

      const expectation = {
        'contactData': {
          'id': expect.any(Number),
          'name': expect.any(String),
          'job_title': expect.any(String),
          'image_url': expect.any(String),
          'interests': expect.any(String),
          'contact_category': expect.any(String),
          'next_date': null,
          'event_id': null,
          'user_id': expect.any(Number)
        },
        'socialMediaData': {
          'contact_id':expect.any(Number),
          'linked_in':expect.any(String),
          'facebook':expect.any(String),
          'gmail':expect.any(String),
          'phone':expect.any(String),
          'twitter':expect.any(String),
          'github':expect.any(String),
          'personal_site':expect.any(String)
        }
      };

      const data = await fakeRequest(app)
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
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // GET
    test('get single contact by id', async() => {

      const expectation = {
        'id': expect.any(Number),
        'name': expect.any(String),
        'job_title': expect.any(String),
        'image_url': expect.any(String),
        'interests': expect.any(String),
        'contact_category': expect.any(String),
        'next_date': null,
        'event_id': null,
        'user_id': expect.any(Number),
        'contact_id':expect.any(Number),
        'linked_in':expect.any(String),
        'facebook':expect.any(String),
        'gmail':expect.any(String),
        'phone':expect.any(String),
        'twitter':expect.any(String),
        'github':expect.any(String),
        'personal_site':expect.any(String)
      };

      const data = await fakeRequest(app)
        .get('/api/contacts/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(expectation);
    });

    // GET
    test('get all contacts by user_id', async() => {

      const expectation = [{
        'gmail': expect.any(String),
        'id': 4,
        'image_url': expect.any(String),
        'job_title': expect.any(String),
        'linked_in': expect.any(String),
        'name': expect.any(String),
        'phone': expect.any(String),
        'user_id': 2
      }];

      const data = await fakeRequest(app)
        .get('/api/contacts')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expect.arrayContaining(expectation));
    });

    // PUT
    test('put contact', async() => {

      const expectation =  {
        'contactData': {
          'id': expect.any(Number),
          'name': expect.any(String),
          'job_title': expect.any(String),
          'image_url': expect.any(String),
          'interests': expect.any(String),
          'contact_category': expect.any(String),
          'next_date': null,
          'event_id': null,
          'user_id': expect.any(Number)
        },
        'socialMediaData': {
          'contact_id':expect.any(Number),
          'linked_in':expect.any(String),
          'facebook':expect.any(String),
          'gmail':expect.any(String),
          'phone':expect.any(String),
          'twitter':expect.any(String),
          'github':expect.any(String),
          'personal_site':expect.any(String)
        }
      };

      const data = await fakeRequest(app)
        .put('/api/contacts/4')
        .set('Authorization', token)
        .send({ name: 'John',
          job_title: 'SWE',
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
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // DELETE
    test('delete contact', async() => {

      const expectation =  [{
        'contact_category': expect.any(String),
        'event_id': null,
        'id': 4,
        'image_url': expect.any(String),
        'interests': expect.any(String),
        'job_title': expect.any(String),
        'name': expect.any(String),
        'next_date': null,
        'user_id': expect.any(Number)
      }];

      const data = await fakeRequest(app)
        .delete('/api/contacts/4')
        .set('Authorization',
          token)
        .expect('Content-Type',
          /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});