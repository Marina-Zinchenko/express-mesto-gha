const { HTTP_STATUS_CONFLICT } = require('http2').constants;

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
