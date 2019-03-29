require('dotenv').config();
const Hapi = require('hapi');
const request = require('request');
const cheerio = require('cheerio');
const crypto = require('crypto');
const Promise = require('bluebird');
const line = require('@line/bot-sdk');

const server = Hapi.server({
    host: '0.0.0.0',
    port: 8000,
});
const client = new line.Client({
  channelAccessToken: 'RMwJeWl2fU0JpVmGb4wK7/qGhojRei2ggQCpYrINEXCmB5maff03CDiiXiY+k7qI0NWkVb1SEx1Rb7pggRtT3EZ7IA+RKzTlP0Ps/3JsBgk53QtKadLssdqcBLFO1CSFOtp4RzSFr/FMdADO7xUOwgdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'f38cf099e61aaaf892d0fe5a35e7c03d',
});
const req = request.defaults({
  baseUrl: 'http://industry.socs.binus.ac.id/learning-plan',
  followAllRedirects: true,
  json: true,
  headers: {      
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                  'Chrome/63.0.3239.84 ' +
                  'Safari/537.36',
  }
});

const post = Promise.promisify(req.post);
const get = Promise.promisify(req.get);

function decrypt() {
  const usndecipher = crypto.createDecipher(process.env.ALGORITHM, process.env.SECRET);
  const pwdecipher = crypto.createDecipher(process.env.ALGORITHM, process.env.SECRET);
  const username = Buffer.concat([usndecipher.update(Buffer.from(process.env.USERNAME.split(','))), usndecipher.final()]);
  const password = Buffer.concat([pwdecipher.update(Buffer.from(process.env.PASSWORD.split(','))), pwdecipher.final()]);

  return {
    username: username.toString(),
    password: password.toString(),
  };
}

async function login(username, password, jar) {
  console.log('logging in...');
  const response = await get('/auth/login', {jar});
  const $ = cheerio.load(response.body);
  const form = {};
  $('input').each((i, el) => {
    form[$(el).attr('name')] = $(el).val();
  });
  form.username = username;
  form.password = password;

  await post('/auth/login', {form, jar});
}

async function submitLB(data, jar) {
  console.log('submitting logbook...');
  const response = await get('/learning-plan/', {jar});
  const $ = cheerio.load(response.body);
  const form = {};
  $('input').each((i, el) => {
    if($(el).attr('name') === 'semester') return;
    data[$(el).attr('name')] ?  form[$(el).attr('name')] = data[$(el).attr('name')] : 
                                form[$(el).attr('name')] = $(el).val()
  });
  form.description = data.description;
  return await post('/student/log-book/insert', {form, jar});
}

const postLB = async (data) => {
  const {username, password} = !data.username || !data.password ?  decrypt() : 
                                {username: data.username, password: data.password};
  const jar = req.jar();

  await login(username, password, jar);
  return (await submitLB(data, jar)).statusCode;
}

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

server.route(
  {
    method: 'POST',
    path: '/',
    handler : (erq, ers) => {
      return erq.payload.events.map(event => {
        return handleEvent(event);
      });
    }
  }
);

server.route(
  {
    method: 'GET',
    path: '/', 
    handler : async (request, h) => {
      return 'TESTING';
      // return await postLB(request.payload) === 200 ? 'success!' : 'failed lol';
    }
  }
);

const start =  async function() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at: ', server.info.uri);
};

start();