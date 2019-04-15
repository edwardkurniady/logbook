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
    if($('title').text().indexOf('Login') > -1) return '';
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
    const response = await this.get('/student/log-book/insert', { jar });
    const $ = cheerio.load(response.body);
    const status = $('.header').last().text();
    if(status.indexOf('already') < 0) return status;
    let log = '';
    $('.ui.compact.table').first().find('tr').each((_, tr) => {
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
      return '';
    }
  }

  async login(lineId, username, password) {
    const jar = this.request.jar();
    const response = await this.get('/auth/login', { jar });
    const $ = cheerio.load(response.body);
    const form = {};
    $('input').each((_, el) => {
      if($(el).val() !== 'Login')
        form[$(el).attr('name')] = $(el).val();
    });
    form.username = username;
    form.password = password;
    const loginResp = await this.post('/auth/login', { form, jar });
    const $login = cheerio.load(loginResp.body);

    const errorMsg = $login('.ui.red').text().trim().replace(/[0-9]+/gm, '');
    if(errorMsg) return errorMsg;

    cookieHandler.saveCookie(lineId, loginResp.headers['set-cookie']);

    return 'Successful login!';
  }

  async submitLogbook(lineId, data) {
    const jar = this.request.jar();
    cookieHandler.loadCookie(lineId, jar);
    const response = await this.get('/student/log-book/insert', { jar });
    const $ = cheerio.load(response.body);
    const form = {};
    $('input').each((_, el) => {
      if($(el).attr('name') === 'semester') return;
      data[$(el).attr('name')] ?  form[$(el).attr('name')] = data[$(el).attr('name')] : 
                                  form[$(el).attr('name')] = $(el).val()
    });
    form.description = data.description;
    await this.post('/student/log-book/insert', { form, jar });
  }

  async resetCookies(lineIdArr) {
    for(let i = 0; i < lineIdArr.length; i++) {
      const jar = this.request.jar();
      cookieHandler.loadCookie(lineIdArr[i], jar);
      const response = await this.get('/', { jar });
      const $ = cheerio.load(response.body);
      if($('title').text().indexOf('Login') > -1) return;
      cookieHandler.saveCookie(lineIdArr[i], response.headers['set-cookie']);
    }
  }

  async weekendFill(lineIdArr, data) {
    for(let i = 0; i < lineIdArr.length; i++) {
      const jar = this.request.jar();
      cookieHandler.loadCookie(lineIdArr[i], jar);
      const response = await this.get('/student/log-book/insert', { jar });
      const $ = cheerio.load(response.body);
      if($('title').text().indexOf('Login') > -1) return;
      const status = $('.header').last().text();
      if(status.indexOf('already') > -1) continue;
      const form = {};
      $('input').each((_, el) => {
        if($(el).attr('name') === 'semester') return;
        data[$(el).attr('name')] ?  form[$(el).attr('name')] = data[$(el).attr('name')] : 
                                    form[$(el).attr('name')] = $(el).val()
      });
      form.description = data.description;
      await this.post('/student/log-book/insert', { form, jar });
    }
  }

  async getUsers(lineIdArr) {
    let str = '';
    for(let i = 0; i < lineIdArr.length; i++) {
      const jar = this.request.jar();
      cookieHandler.loadCookie(lineIdArr[i], jar);
      const response = await this.get('/student/log-book/insert', { jar });
      const $ = cheerio.load(response.body);
      if($('title').text().indexOf('Login') > -1) return;
      str += await this.getProfile(jar);
    }
    return str;
  }

  async logout(lineId) {
    const jar = this.request.jar();
    cookieHandler.loadCookie(lineId, jar);
    const response = await this.get('/logout', { jar });
    cookieHandler.saveCookie(lineId, response.headers['set-cookie']);
    return 'Successful Logout!';
  }
}

module.exports = Logbook;
