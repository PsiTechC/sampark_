const bcrypt = require('bcryptjs');

const providedPassword = 'cmslx7ol'; // Replace with the actual password user is entering
const storedHash = '$2a$10$hpYyOgewAl8P9jdE4XNQMelNgrRLDuFfDbCGZ1MJAQkzB/SjRZt4S'; // Replace with the actual hash

bcrypt.compare(providedPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error during hash comparison:', err);
  } else {
    console.log('Password match:', result); // Should be true if the password matches
  }
});
