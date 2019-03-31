const {
  line,
  crypto,
} = require('../../config/headers');

const {
  LINE_CLIENT_CONFIG,
  channelSecret,
} = require('../../config/const');

const isSignatureValid = (req) => {
  return req.headers['x-line-signature'] === crypto.createHmac('sha256', channelSecret)
                                                .update(JSON.stringify(req.payload))
                                                .digest('base64');
};

module.exports = {
  handleEvent: (req) => {
    if(!isSignatureValid(req)) return; 
    console.log(req.headers);
    console.log(JSON.stringify(req.payload));
    return req.payload.events.map(event => {
      if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
      }

      const client = new line.Client(LINE_CLIENT_CONFIG);
    
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
      });
    });    
  },

  defaultPage: () => {
    const client = new line.Client(LINE_CLIENT_CONFIG);
    
    return client.replyMessage(event.replyToken, {
      type: 'you are gay',
      text: event.message.text
    });
  },
};
