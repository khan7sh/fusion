const bcrypt = require('bcrypt');

const password = 'shokh123'; // Replace this with your actual chosen password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Hashed password:', hash);
    console.log('Add this hash to your .env file as ADMIN_PASSWORD_HASH');
  }
});
