const {
  HAPI_SERVER_CONFIG,
} = require('./config/const');
const {
  Hapi,
} = require('./config/headers');
const routes = require('./api/routes/connect');

const start =  async function() {
  try {
    const server = Hapi.server(HAPI_SERVER_CONFIG);
    routes.forEach(route => {
      server.route(route);
    });
    await server.start();
    console.log(`SERVER: Server running at ${server.info.uri}`);
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();