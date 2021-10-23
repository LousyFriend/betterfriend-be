require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app contacts routes', () => {
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
    test('post comment', async() => {

      const expectation = [{
        comment_id: expect.any(Number),
        comment: expect.any(String),
        user_id: expect.any(Number),
        contact_id: expect.any(Number),
      }];

      const data = await fakeRequest(app)
        .post('/api/comments/1')
        .send({ comment: 'hello' })
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // GET
    test('get comment', async() => {

      const expectation = [{
        comment_id: expect.any(Number),
        comment: expect.any(String),
        user_id: expect.any(Number),
        contact_id: expect.any(Number),
      }];

      const data = await fakeRequest(app)
        .get('/api/comments/1')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expect.arrayContaining(expectation));
    });

    // DELETE
    test('delete comment', async() => {

      const expectation = [{
        comment_id: expect.any(Number),
        comment: expect.any(String),
        user_id: expect.any(Number),
        contact_id: expect.any(Number),
      }];

      const data = await fakeRequest(app)
        .delete('/api/comments/1')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expect.arrayContaining(expectation));
    });
  });
});
