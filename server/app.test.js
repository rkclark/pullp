import request from 'supertest';
import server from './app';

const testTitle = '<title>CTM React Boilerplate</title>';

describe('Server', () => {
  it('Returns 200 response for /', () => (
    request(server)
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.text).toContain(testTitle);
      })
  ));
  it('Returns 200 response for /app', () => (
    request(server)
      .get('/app')
      .expect(200)
      .then((response) => {
        expect(response.text).toContain(testTitle);
      })
  ));
  it('Returns 200 response for /counter', () => (
    request(server)
      .get('/counter')
      .expect(200)
       .then((response) => {
         expect(response.text).toContain(testTitle);
       })
  ));
});
