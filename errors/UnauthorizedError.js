const { HTTP_STATUS_UNAUTHORIZED } = require('http2').constants;

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
