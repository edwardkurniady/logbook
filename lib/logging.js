const {
  moment,
} = require('../config/headers');

module.exports.logger = (message) => {
  const time = moment.tz('Asia/Jakarta').format('MMMM Do YYYY, h:mm:ss a');
  console.log(time + ' | ' + message);
};
