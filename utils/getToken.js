const jwt = require('jsonwebtoken');
const secretKey = require('./constants');

module.exports.getToken = (id) => {
  const token = jwt.sign({ payload: id }, secretKey, { expiresIn: '7d' });
  return token;
};
