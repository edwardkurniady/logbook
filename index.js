const {
  HAPI_SERVER_CONFIG,
} = require('./config/const');
const {
  Glue,
} = require('./config/headers');
const routes = require('./api/routes/connect');

const manifest = {
  server: HAPI_SERVER_CONFIG,
  register: {
    plugins: [
      './plugins/cron',
    ],
  },
};

const start =  async function() {
  try {
    const server = await Glue.compose(manifest, { relativeTo: __dirname });
    routes.forEach(route => server.route(route));
    await server.start();
    console.log(`SERVER: Server running at ${server.info.uri}`);
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
