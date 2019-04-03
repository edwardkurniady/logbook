const { line } = require('../../config/headers');
const { LINE_CLIENT_CONFIG, message } = require('../../config/const');
const { isSignatureValid } = require('../../lib/validator')
const Logbook = require('../services/logbook');

async function getLoginStatus(lineId) {
  const logbook = new Logbook();
  const loginStatus = await logbook.checkLoginStatus(lineId);
  return loginStatus === 'false' ?  message.notLoggedIn : 
                                    'You are logged in as ' + loginStatus + '. ';
}

async function login(lineId, msgArr) {
  if(msgArr.length !== 3) return 'Wrong message format!'
  if(msgArr[1].length !== 10 || !Number(msgArr[1])) return 'Wrong username format!'
  const logbook = new Logbook();
  return await logbook.login(lineId, msgArr[1], msgArr[2]);
}

async function getLogbookStatus(lineId) {
  const logbook = new Logbook();
  const loginStatus = await logbook.checkLoginStatus(lineId);
  if(loginStatus === 'false') return message.lbNotLoggedIn;
  let lbStatus = await logbook.checkLogbookStatus(lineId);
  return lbStatus.indexOf('already') < 0 ?  lbStatus + '\n' + message.lbNotFilled :
                                            lbStatus;
}

async function submitLogbook(lineId, msgArr) {
  if(msgArr.length < 5) return 'Wrong message format!'
  const logbook = new Logbook();
  const loginStatus = await logbook.checkLoginStatus(lineId);
  if(loginStatus === 'false') return message.lbNotLoggedIn;
  const data = {
    'clock-in': msgArr[1],
    'clock-out': msgArr[2],
    activity: msgArr[3],
    description: '',
  }
  for(let i = 4; i < msgArr.length; i++) {
    description += msgArr[i];
  }
  await logbook.submitLogbook(lineId, data);
  return 'Submit Logbook Successful!';
}

function isRequestValid(req) {
  if(!isSignatureValid(req.headers['x-line-signature'], req.payload)) return false;
  if(req.payload.events[0].type !== 'message') return false;
  if(req.payload.events[0].message.type !== 'text') return false;
  return true;
}

async function handleEvent(req) {
  if(!isRequestValid(req)) return Promise.resolve(null);
  const event = req.payload.events[0];
  console.log(event.message.text);
  const lineId = event.source.userId;
  const msgArr = event.message.text.split('\n');
  console.log(msgArr);
  const replyMessage = {
    type: 'text',
  };
  const action = msgArr[0].toLowerCase();

  if(action === '--login') replyMessage.text = await getLoginStatus(lineId);
  if(action === 'login') replyMessage.text = await login(lineId, msgArr);
  if(action === '--logbook') replyMessage.text = await getLogbookStatus(lineId);
  if(action === 'logbook') replyMessage.text = await submitLogbook(lineId, msgArr);
  if(action === '--help') replyMessage.text = message.help;

  const client = new line.Client(LINE_CLIENT_CONFIG);
  return client.replyMessage(event.replyToken, replyMessage);
}

module.exports = {
  handleEvent,
};
