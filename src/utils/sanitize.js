// Input validation and sanitization utilities

// Sanitize string input to prevent injection attacks
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  // Remove potential MongoDB operators
  return str.replace(/[${}]/g, '');
};

// Sanitize email
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.toLowerCase().trim().replace(/[^a-z0-9@._-]/gi, '');
};

// Validate and sanitize MongoDB ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Sanitize query object to remove operators from keys
const sanitizeQuery = (query) => {
  if (typeof query !== 'object' || query === null) return query;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(query)) {
    // Remove $ operators from keys
    const cleanKey = key.replace(/^\$/, '');
    
    if (typeof value === 'object' && value !== null) {
      sanitized[cleanKey] = sanitizeQuery(value);
    } else if (typeof value === 'string') {
      sanitized[cleanKey] = sanitizeString(value);
    } else {
      sanitized[cleanKey] = value;
    }
  }
  
  return sanitized;
};

module.exports = {
  sanitizeString,
  sanitizeEmail,
  isValidObjectId,
  sanitizeQuery
};
