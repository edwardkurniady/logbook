const { fs } = require('../config/headers');

module.exports.readStorage = () => {
  return fs.readdirSync('./api/storage/').map(file => {
    return file.replace(/\.[a-zA-Z]+/gm, '');
  });
};
