require('./headers').dotenv;
const baseUrl = 'https://industry.socs.binus.ac.id/learning-plan';
const channelAccessToken = process.env.TOKEN;
const channelSecret = process.env.SECRET;
const adminId = process.env.ADMIN;

const HAPI_SERVER_CONFIG = {
  host: process.env.HOST,
  port: process.env.PORT,
};

const LINE_CLIENT_CONFIG = {
  channelAccessToken,
  channelSecret,
};

const REQUEST_CONFIG = {
  baseUrl,
  followAllRedirects: true,
  json: true,
  headers: {      
    'Accept': 'text/html,application/xhtml+xml,application/' +
              'xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                  'Chrome/63.0.3239.84 ' +
                  'Safari/537.36',
  },
};

const format = {
  general: '\nACTION\nDATA',
  login: '\nlogin\nUSERNAME\nPASSWORD',
  logbook: '\nlogbook\nCLOCK IN\nCLOCK OUT\nACTIVITY\nDESCRIPTION',
  oneForAll: '\noneforall\nUSERNAME\nPASSWORD\nCLOCK IN\nCLOCK OUT\nACTIVITY\nDESCRIPTION'
};

const message = {
  notLoggedIn: 'You are not logged in. You can login by sending a message with the following format:' + format.login,
  lbNotLoggedIn: 'You are not logged in. Please login first.',
  loggedIn: 'You can login with a different account by resending the login message:' + format.login,
  lbNotFilled: 'You can submit today\'s logbook by sending a message with the following format:' + format.logbook,
  oneForAll: 'Login, submit logbook, send ONE message to do them ALL with.. ONE FOR ALL!' + format.oneForAll,
  dailyReminder: 'I see you haven\'t filled today\'s logbook, please fill it asap ^^',
  help: 'Logbook Made Easy is a Line Messaging API that helps binusian fill their logbook. ' +
        'To do so, LBM8EZ needs your login credentials. But don\'t worry, LBM8EZ doesn\'t store your username or password. ' +
        'LBM8EZ reads your message and acts according to it. Therefore, your message needs to be in the correct format. ' +
        'To know what the accepted format is, choose from the quick menu the action you want to perform. ' +
        'In general the message format you should send is:' + format.general + '\n' +
        'ACTION is case insensitive.',
};

module.exports = {
  HAPI_SERVER_CONFIG,
  LINE_CLIENT_CONFIG,
  REQUEST_CONFIG,
  channelAccessToken,
  channelSecret,
  baseUrl,
  message,
  adminId,
};
