const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.status = HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
