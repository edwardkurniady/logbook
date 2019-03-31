const channelAccessToken =  'RMwJeWl2fU0JpVmGb4wK7/qGhojRei2ggQCpYrINEXCmB5maff03CDiiXiY+k7qI0NWkVb1SEx1Rb7pggRtT3EZ7IA+RKzTlP0Ps/' +
                            '3JsBgk53QtKadLssdqcBLFO1CSFOtp4RzSFr/FMdADO7xUOwgdB04t89/1O/w1cDnyilFU=';

const channelSecret = 'f38cf099e61aaaf892d0fe5a35e7c03d';

const HAPI_SERVER_CONFIG = {
  host: '0.0.0.0',
  port: 8000,
};

const LINE_CLIENT_CONFIG = {
  channelAccessToken,
  channelSecret,
};

module.exports = {
  HAPI_SERVER_CONFIG,
  LINE_CLIENT_CONFIG,
  channelAccessToken,
  channelSecret,
};
