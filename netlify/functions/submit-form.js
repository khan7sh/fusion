const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Contact = require('../../backend/models/Contact');

exports.handler = async (event, context) => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });

  const { name, email, budget, message } = JSON.parse(event.body);

  // Validation logic here

  try {
    const newContact = new Contact({ name, email, budget, message });
    await newContact.save();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Thank you for your message. We will get in touch soon!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving contact form' })
    };
  }
};