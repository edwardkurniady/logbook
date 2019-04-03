const channelAccessToken =  'S5dfUzY6Usjq1EeQuIg+rXQaCGtJdXkJiFYpk42kDZfO2oSUFp3IG5MUihSxzX6DfJTpFjahgL8rFBrpGV4XWt/' +
                            'JtK7gSxDhWOFYZM10GjxOgs/7WhOxtP+BSSH6Vx2IKLL998Yf5lPwmu4AYckstwdB04t89/1O/w1cDnyilFU=';

const channelSecret = 'bcb7d9d0f23de6ee6c1e3c872daaae4b';

const baseUrl = 'http://industry.socs.binus.ac.id/learning-plan';

const HAPI_SERVER_CONFIG = {
  host: '0.0.0.0',
  port: 8000,
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
  }
};

const format = {
  login: '\nlogin\nUSERNAME\nPASSWORD',
  logbook: '\nlogbook\nCLOCK IN\n CLOCK OUT\nACTIVITY\nDescription',
}

const message = {
  notLoggedIn: 'You are not logged in. You can login by sending a message with the following format:' + format.login,
  reLogin: 'You can login with a different account by resending the login message with different credentials. Format:' + format.login,
  help: 'Logbook Made Easy is a Line Messaging API that helps binusian fill their logbook. ' +
        'To do so, LBM8EZ needs your login credentials. But don\'t worry, LBM8EZ doens\'t store your username or password. ' +
        'What it does store however, is your login session which will expire in \u00B12 hours. Hence you need to relogin every once in a while. ' + 
        'LBM8EZ reads your message and acts according to it. Therefore, your message needs to be in the correct format. ' +
        'To know what the accepted format is, choose from the quick menu the action you want to perform. ' +
        'In general the message format you should send is:\nACTION\nDATA',
  lbNotLoggedIn: 'You are not logged in. Please login first.',
  lbNotFilled: 'You can submit today\'s logbook by sending a message with the following format:' + format.logbook,
  lbRefill: 'You can change today\'s logbook content by sending the logbook message with different data. Format:' + format.logbook,
}

module.exports = {
  HAPI_SERVER_CONFIG,
  LINE_CLIENT_CONFIG,
  REQUEST_CONFIG,
  channelAccessToken,
  channelSecret,
  baseUrl,
  message,
};
