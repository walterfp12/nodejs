const { Transform } = require('node:stream');

class FormateadorCSV extends Transform {
  constructor(options = {}) {
    super({ ...options, decodeStrings: true });
  }

  _transform(chunk, encoding, callback) {
    try {
      const data = chunk.toString('utf8').replace(/,/g, ' | ');
      callback(null, data);
    } catch (error) {
      callback(error);
    }
  }
}

module.exports = FormateadorCSV;