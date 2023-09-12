const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.status = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequest;
