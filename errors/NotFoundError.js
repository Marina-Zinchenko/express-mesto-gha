const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
