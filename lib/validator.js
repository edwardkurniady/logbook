const { channelSecret } = require('../config/const');
const { crypto } = require('../config/headers');

module.exports.isSignatureValid = (signature) => {
  return signature ===  crypto.createHmac('sha256', channelSecret)
                        .update(JSON.stringify(req.payload))
                        .digest('base64');
};