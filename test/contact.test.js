const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Make sure to export app from server.js
const Contact = require('../models/Contact');

beforeAll(async () => {
  // Connect to a test database before running tests
  const url = process.env.TEST_MONGODB_URI || "mongodb://localhost:27017/testdb";
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Disconnect from and clean the database after tests
  await Contact.deleteMany({});
  await mongoose.connection.close();
});

describe('Contact Submission', () => {
  it('should create a new contact', async () => {
    const res = await request(app)
      .post('/submit-form')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        budget: '$1000-$5000',
        message: 'This is a test message'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Thank you for your message. We will get in touch soon!');

    // Check if the contact was actually saved to the database
    const contact = await Contact.findOne({ email: 'test@example.com' });
    expect(contact).toBeTruthy();
    expect(contact.name).toBe('Test User');
  });

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .post('/submit-form')
      .send({
        name: '',
        email: 'invalid-email',
        budget: '',
        message: ''
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe('Contact Retrieval', () => {
  it('should retrieve contacts for admin', async () => {
    // First, we need to mock an admin session
    const agent = request.agent(app);
    await agent.get('/temp-admin-login'); // Using the temporary admin login route

    const res = await agent.get('/contacts');
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should not allow non-admins to retrieve contacts', async () => {
    const res = await request(app).get('/contacts');
    
    expect(res.statusCode).toBe(401);
  });
});