const bcrypt = require('bcryptjs');

const providedPassword = 'jyoti'; // Replace with the actual password user is entering
const storedHash = '$2a$10$1iAh4mgm8JUNeUN5H6GHXeqHtL241Y9wL/YO4N1s6TKPuoCYdSiAm'; // Replace with the actual hash

bcrypt.compare(providedPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error during hash comparison:', err);
  } else {
    console.log('Password match:', result); // Should be true if the password matches
  }
});
