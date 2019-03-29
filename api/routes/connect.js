const controller = require('../controllers/connect');

module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: controller.defaultPage,
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