const {
  request,
  cheerio,
  Promise,
} = require('../../config/headers');
const {
  baseUrl,
  REQUEST_CONFIG,
} = require('../../config/const');
const cookieHandler = require('../../lib/cookieHandler')

class Logbook {
  constructor() {
    this.request = request.defaults(REQUEST_CONFIG);
    this.post = Promise.promisify(this.request.post);
    this.get = Promise.promisify(this.request.get);
  }

  async checkLoginStatus(lineId) {
    try {
      const jar = this.request.jar();
      jar.getCookies(baseUrl);
      cookieHandler.loadCookie(lineId, jar);

      const response = await this.get('/profile', { jar });
      const $ = cheerio.load(response.body);
      if($('title').text() === 'Login') return 'false';
      const creds = {
        name: '',
        nim: '',
      }
      $('.twelve.wide.column.profile').find('.row').each((i, elm) => {
        const value = $(elm).find('h2').text().split('\n')[0].trim();
        if(i === 0) creds.nim = value;
        if(i === 1) creds.name = value;
      });

      return creds.name + ' - ' + creds.nim;
    }catch(e) {
      return 'false';
    }
  }

  async login(lineId, username, password) {
    const jar = this.request.jar();
    const response = await this.get('/auth/login', { jar });
    const $ = cheerio.load(response.body);
    const form = {};
    $('input').each((_, el) => {
      form[$(el).attr('name')] = $(el).val();
    });
    form.username = username;
    form.password = password;
  
    const loginResp = await this.post('/auth/login', { form, jar });
    const $login = cheerio.load(loginResp.body);

    if($login('.ui.red').length === 1) return $login('.ui.red').text().trim();

    cookieHandler.saveCookie(lineId, loginResp.headers['set-cookie']);

    return 'Login Successful!';
  }
}
// const request = require('request');
// const cheerio = require('cheerio');
// const Promise = require('bluebird');
// const line = require('@line/bot-sdk');

// const client = new line.Client({
//   channelAccessToken: 'RMwJeWl2fU0JpVmGb4wK7/qGhojRei2ggQCpYrINEXCmB5maff03CDiiXiY+k7qI0NWkVb1SEx1Rb7pggRtT3EZ7IA+RKzTlP0Ps/3JsBgk53QtKadLssdqcBLFO1CSFOtp4RzSFr/FMdADO7xUOwgdB04t89/1O/w1cDnyilFU=',
//   channelSecret: 'f38cf099e61aaaf892d0fe5a35e7c03d',
// });

// const req = request.defaults({
//   baseUrl: 'http://industry.socs.binus.ac.id/learning-plan',
//   followAllRedirects: true,
//   json: true,
//   headers: {      
//     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
//                   'AppleWebKit/537.36 (KHTML, like Gecko) ' +
//                   'Chrome/63.0.3239.84 ' +
//                   'Safari/537.36',
//   }
// });

// const post = Promise.promisify(req.post);
// const get = Promise.promisify(req.get);

// async function login(username, password, jar) {
//   console.log('logging in...');
//   const response = await get('/auth/login', {jar});
//   const $ = cheerio.load(response.body);
//   const form = {};
//   $('input').each((i, el) => {
//     form[$(el).attr('name')] = $(el).val();
//   });
//   form.username = username;
//   form.password = password;

//   await post('/auth/login', {form, jar});
// }

// async function submitLB(data, jar) {
//   console.log('submitting logbook...');
//   const response = await get('/learning-plan/', {jar});
//   const $ = cheerio.load(response.body);
//   const form = {};
//   $('input').each((i, el) => {
//     if($(el).attr('name') === 'semester') return;
//     data[$(el).attr('name')] ?  form[$(el).attr('name')] = data[$(el).attr('name')] : 
//                                 form[$(el).attr('name')] = $(el).val()
//   });
//   form.description = data.description;
//   return await post('/student/log-book/insert', {form, jar});
// }

// const postLB = async (data) => {
//   const {username, password} = data;
//   const jar = req.jar();

//   await login(username, password, jar);
//   return (await submitLB(data, jar)).statusCode;
// }

module.exports = Logbook;