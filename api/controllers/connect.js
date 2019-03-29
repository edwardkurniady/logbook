module.exports = {
  handleEvent: (req) => {
    return req.payload.events.map(event => {
      if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
      }
    
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