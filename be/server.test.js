import request from 'supertest';
import app from './server';  

describe('API Endpoints', () => {
  // Test for root route
  it('should return a welcome message on the root route', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Testing: Welcome to the API!');
  });

  // Test for valid login
  it('should return success for valid login', async () => {
    const validUser = {
      email: 'user1@example.com',
      password: 'password1'
    };

    const response = await request(app)
      .post('/api/login')
      .send(validUser)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  // Test for invalid login
  it('should return failure for invalid login', async () => {
    const invalidUser = {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/login')
      .send(invalidUser)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: false });
  });
});
