const { channelSecret } = require('../config/const');
const { crypto } = require('../config/headers');

module.exports.isSignatureValid = (signature, payload) => {
  return signature ===  crypto.createHmac('sha256', channelSecret)
                        .update(JSON.stringify(payload))
                        .digest('base64');
};