const { line } = require('../../config/headers');
const { LINE_CLIENT_CONFIG, message } = require('../../config/const');
const { isSignatureValid } = require('../../lib/validator')
const Logbook = require('../services/logbook');

async function getLoginStatus(lineId) {
  const logbook = new Logbook();
  const loginStatus = await logbook.checkLoginStatus(lineId);
  return loginStatus === 'false' ?  message.notLoggedin : 
                                    'You are logged in as ' + loginStatus + '. ' + message.reLogin;
}

async function login(lineId, msgArr) {
  if(msgArr.length !== 3) return 'Wrong message format!'
  if(msgArr[1].length !== 10) return 'Wrong username format!'
  const logbook = new Logbook();
  return await logbook.login(lineId, msgArr[1], msgArr[2]);
}

async function handleEvent(req) {
  if(!isSignatureValid(req.headers['x-line-signature'], req.payload)) return;
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
