const controller = require('../controllers/connect');

module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: () => {
        return 'testing';
      },
    },
  },
  {
    method: 'POST',
    path: '/',
    config: {
      handler: controller.handleEvent,
    },
  },
];
