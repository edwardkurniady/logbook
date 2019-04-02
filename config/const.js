const channelAccessToken =  'RMwJeWl2fU0JpVmGb4wK7/qGhojRei2ggQCpYrINEXCmB5maff03CDiiXiY+k7qI0NWkVb1SEx1Rb7pggRtT3EZ7IA+RKzTlP0Ps/' +
                            '3JsBgk53QtKadLssdqcBLFO1CSFOtp4RzSFr/FMdADO7xUOwgdB04t89/1O/w1cDnyilFU=';

const channelSecret = 'f38cf099e61aaaf892d0fe5a35e7c03d';

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

const message = {
  loginHow: ' by sending a message with the following format:\nlogin\nUSERNAME\nPASSWORD',
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
