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

async function login(lineId, msgArr) {
  if(msgArr[1].length !== 10) return 'Wrong username format! Please try again.'
  const logbook = new Logbook();
  return await logbook.login(lineId, msgArr[1], msgArr[2]);
}

async function handleEvent(req) {
  if(!isSignatureValid(req)) return;
  const event = req.payload.events[0];
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const lineId = event.source.userId;
  const msgArr = event.message.text.split('\n');
  const replyMessage = {
    type: 'text',
  };
  const action = msgArr[0].toLowerCase();

  if(action === '--login') replyMessage.text = await getLoginStatus(lineId);
  if(action === 'login') replyMessage.text = await login(lineId, msgArr);

  const client = new line.Client(LINE_CLIENT_CONFIG);
  return client.replyMessage(event.replyToken, replyMessage);
}

module.exports = {
  handleEvent,
};
