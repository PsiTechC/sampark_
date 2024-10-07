const bcrypt = require('bcryptjs');

const providedPassword = 'Admin@1234'; // Replace with the actual password user is entering
const storedHash = '$2a$10$hvfmO6.XO6LTe0TrXGwJt.EyM6eoNF1dAxjaYKYLEMnlS9XKclyVC'; // Replace with the actual hash

bcrypt.compare(providedPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error during hash comparison:', err);
  } else {
    console.log('Password match:', result); // Should be true if the password matches
  }
});
