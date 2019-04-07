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
    method: 'GET',
    path: '/cookieres',
    config: {
      handler: controller.cookieReset,
    },
  },
  {
    method: 'GET',
    path: '/weekendfiller',
    config: {
      handler: controller.weekendFill,
    },
  },
  {
    method: 'GET',
    path: '/logbookreminder',
    config: {
      handler: controller.dailyLBReminder,
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
