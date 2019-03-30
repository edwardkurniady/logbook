const {
  LINE_CLIENT_CONFIG,
} = require('../../config/const');
const {
  line,
} = require('../../config/headers');

module.exports = {
  handleEvent: (req) => {
    console.log(req);
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
    return 'This is default page';
  },
};