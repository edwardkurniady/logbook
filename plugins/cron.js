const { HapiCron } = require('../config/headers');

module.exports = {
  plugin: HapiCron,
  options: {
    jobs: [
      {
        name: 'cookieres',
        time: '0 0 * * * *',
        timezone: 'Asia/Jakarta',
        request: {
          method: 'GET',
          url: '/cookieres',
        },
      },
      {
        name: 'weekendfiller',
        time: '0 0 12 * * 0,6',
        timezone: 'Asia/Jakarta',
        request: {
          method: 'GET',
          url: '/weekendfiller',
        },
      },
      {
        name: 'logbookreminder',
        time: '0 27 9 * * 1-5',
        timezone: 'Asia/Jakarta',
        request: {
          method: 'GET',
          url: '/logbookreminder',
        },
      },
    ],
  },
};
