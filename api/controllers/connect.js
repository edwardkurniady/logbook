const {
  line,
  crypto,
} = require('../../config/headers');

const {
  LINE_CLIENT_CONFIG,
  channelSecret,
} = require('../../config/const');

const Logbook = require('../services/logbook');

const isSignatureValid = (req) => {
  return req.headers['x-line-signature'] === crypto.createHmac('sha256', channelSecret)
                                                .update(JSON.stringify(req.payload))
                                                .digest('base64');
};


async function getLoginStatus(lineId) {
  const logbook = new Logbook();
  return await logbook.checkLoginStatus(lineId) ? 'You are logged in' :
                                                  'You are not logged in';
}

async function handleEvent(req) {
  if(!isSignatureValid(req)) return;
  return req.payload.events.map(event => {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }

    const lineId = event.source.userId;
    const msgArr = event.message.text.split('\n');
    const replyMessage = {
      type: 'text',
    };

    switch(msgArr[0].toLowerCase()) {
      case '--help' :
        replyMessage.text = '';
        break;
      case '--login' :
        replyMessage.text = await getLoginStatus(lineId);
        break;
      case 'login' :
        break;
    }

    const client = new line.Client(LINE_CLIENT_CONFIG);
    return client.replyMessage(event.replyToken, replyMessage);
  });
}

module.exports = {
  handleEvent,
};
