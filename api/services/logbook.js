const {
  request,
  cheerio,
  Promise,
} = require('../../config/headers');
const {
  REQUEST_CONFIG,
} = require('../../config/const');
const cookieHandler = require('../../lib/cookieHandler')

class Logbook {
  constructor() {
    this.request = request.defaults(REQUEST_CONFIG);
    this.post = Promise.promisify(this.request.post);
    this.get = Promise.promisify(this.request.get);
  }

  async getProfile(jar) {
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
  }

  async checkLogbookStatus(lineId) {
    const jar = this.request.jar();
    cookieHandler.loadCookie(lineId, jar);
    const response = await this.get('/', {jar});
    const $ = cheerio.load(response.body);
    const status = $('.header').last().text();
    if(status.indexOf('already') < 0) return status;
    let log = '';
    $('.compact').find('tr').each((_, tr) => {
      const td = $(tr).children();
      log += '\n' + td.first().text() + ': ' + td.last().text();
    });
    return status + log;
  }

  async checkLoginStatus(lineId) {
    try {
      const jar = this.request.jar();
      cookieHandler.loadCookie(lineId, jar);
      return await this.getProfile(jar);
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

    return 'Successful login!';
  }

  async submitLogbook(lineId, data) {
    const jar = this.request.jar();
    cookieHandler.loadCookie(lineId, jar);
    const response = await this.get('/', {jar});
    const $ = cheerio.load(response.body);
    const form = {};
    $('input').each((i, el) => {
      if($(el).attr('name') === 'semester') return;
      data[$(el).attr('name')] ?  form[$(el).attr('name')] = data[$(el).attr('name')] : 
                                  form[$(el).attr('name')] = $(el).val()
    });
    form.description = data.description;
    await this.post('/student/log-book/insert', {form, jar});
  }
}

module.exports = Logbook;
