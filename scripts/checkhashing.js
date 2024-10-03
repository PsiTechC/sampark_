const bcrypt = require('bcryptjs');

const providedPassword = 'Admin@1234'; // Replace with the actual password user is entering
const storedHash = '$2a$10$nTBg/FV37VIvuTp8kVowaOW5UAXJFZhcbFeHVDTTId3mB222F91xy'; // Replace with the actual hash

bcrypt.compare(providedPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error during hash comparison:', err);
  } else {
    console.log('Password match:', result); // Should be true if the password matches
  }
});
