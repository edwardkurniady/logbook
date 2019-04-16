const { line } = require('../../config/headers');
const { 
  LINE_CLIENT_CONFIG, 
  message,
  adminId,
} = require('../../config/const');
const { isSignatureValid } = require('../../lib/validator')
const { readStorage } = require('../../lib/readStorage');
const { logger } = require('../../lib/logging');
const Logbook = require('../services/logbook');

async function getLoginStatus(lineId) {
  const logbook = new Logbook();
  const loginStatus = await logbook.checkLoginStatus(lineId);
  return !loginStatus ?  message.notLoggedIn : 
                        'You are logged in as:\n' + loginStatus + '\n' + message.loggedIn;
}

async function login(lineId, msgArr) {
  if(msgArr.length !== 3) return 'Wrong message format!';
  if(msgArr[1].length !== 10 || !Number(msgArr[1])) return 'Wrong username format!';
  const logbook = new Logbook();
  return await logbook.login(lineId, msgArr[1], msgArr[2]);
}

async function getLogbookStatus(lineId) {
  const logbook = new Logbook();
  const loginStatus = await logbook.checkLoginStatus(lineId);
  if(!loginStatus) return message.lbNotLoggedIn;
  const lbStatus = await logbook.checkLogbookStatus(lineId);
  return lbStatus.indexOf('already') < 0 ?  lbStatus + '\n' + message.lbNotFilled :
                                            lbStatus;
}

async function submitLogbook(lineId, msgArr) {
  if(msgArr.length < 5) return 'Wrong message format!';
  const logbook = new Logbook();
  const loginStatus = await logbook.checkLoginStatus(lineId);
  if(!loginStatus) return message.lbNotLoggedIn;
  const data = {
    'clock-in': msgArr[1],
    'clock-out': msgArr[2],
    activity: msgArr[3],
    description: '',
  }
  for(let i = 4; i < msgArr.length; i++) {
    data.description += msgArr[i];
    if(i !== msgArr.length - 1) data.description += '\n';
  }
  await logbook.submitLogbook(lineId, data);
  return 'Submit logbook successful!';
}

async function plusUltra(lineId, msgArr) {
  if(msgArr.length < 7) return 'Wrong message format!';
  if(msgArr[1].length !== 10 || !Number(msgArr[1])) return 'Wrong username format!';
  const keys = ['username', 'password', 'clock-in', 'clock-out', 'activity', 'description'];
  const data = {};
  for(let i = 1; i < msgArr.length; i++) {
    keys.length > 0 ? data[keys.shift()] = msgArr[i] :
                      data.description += '\n' + msgArr[i];
  }
  const logbook = new Logbook();
  const loginResp = await logbook.login(lineId, data.username, data.password);
  if(loginResp !== 'Successful login!') return loginResp;
  await logbook.submitLogbook(lineId, data);
  return 'Plus Ultra!';
}

async function getUsers(lineId) {
  if(lineId !== adminId) return '';
  console.log('dhira');
  const logbook = new Logbook();
  return await logbook.getUsers(readStorage());
}

async function logout(lineId) {
  const logbook = new Logbook();
  return await logbook.logout(lineId);
}

function isRequestValid(req) {
  if(!isSignatureValid(req.headers['x-line-signature'], req.payload)) return false;
  if(req.payload.events[0].type !== 'message') return false;
  if(req.payload.events[0].message.type !== 'text') return false;
  return true;
}

module.exports = {
  handleEvent: async(req) => {
    if(!isRequestValid(req)) return Promise.resolve(null);
    const event = req.payload.events[0];
  
    const lineId = event.source.userId;
    const msgArr = event.message.text.split('\n').map(msg => msg.trim()).filter(msg => msg);
    const replyMessage = {
      type: 'text',
    };
    const action = msgArr[0].toLowerCase();
    
    if(action === '--login') replyMessage.text = await getLoginStatus(lineId);
    if(action === 'login') replyMessage.text = await login(lineId, msgArr);
    if(action === '--logbook') replyMessage.text = await getLogbookStatus(lineId);
    if(action === 'logbook') replyMessage.text = await submitLogbook(lineId, msgArr);
    if(action === '--oneforall') replyMessage.text = message.oneForAll;
    if(action === 'oneforall') replyMessage.text = await plusUltra(lineId, msgArr);
    if(action === '--help') replyMessage.text = message.help;
    if(action === '--getusers') replyMessage.text = await getUsers(lineId);
    if(action === 'logout') replyMessage.text = await logout(lineId);

    logger(JSON.stringify({lineId, action, replyMessage}, null, 2));

    const client = new line.Client(LINE_CLIENT_CONFIG);
    return client.replyMessage(event.replyToken, replyMessage);
  },
  cookieReset: () => {
    const logbook = new Logbook();
    logbook.resetCookies(readStorage());
    logger('Cookie Reset');
    return Promise.resolve(null);
  },
  weekendFill: () => {
    const logbook = new Logbook();
    logbook.weekendFill(readStorage(), {
      'clock-in': 'OFF',
      'clock-out': 'OFF',
      'activity': 'OFF',
      'description': 'OFF',
    });
    logger('Weekend Auto Fill');
    return Promise.resolve(null);
  },
  dailyLBReminder: async() => {
    const client = new line.Client(LINE_CLIENT_CONFIG);
    const logbook = new Logbook();
    const lineIdArr = readStorage();
    const lineIds = [];
    for(let i = 0; i < lineIdArr.length; i++) {
      const loginStatus = await logbook.checkLoginStatus(lineIdArr[i]);
      if(!loginStatus) continue;
      const lbStatus = await logbook.checkLogbookStatus(lineIdArr[i]);
      if(lbStatus.indexOf('already') < 0) lineIds.push(lineIdArr[i]);
    }
    console.log(lineIds)
    // client.multicast(lineIds, message.dailyReminder);
    logger('Reminder');
    return Promise.resolve(null);
  },
};
