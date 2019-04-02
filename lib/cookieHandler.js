const { fs } = require('../config/headers');
const { baseUrl } = require('../config/const');

module.exports = {
  loadCookie: (lineId, jar) => {
    const path = './api/storage/' + lineId + '.json';
    let setCookie = JSON.parse(fs.readFileSync(path, 'utf-8')).setCookie;
    if(!(setCookie instanceof Array)) setCookie = [setCookie];
    setCookie.forEach(sc => {
      jar.setCookie(sc, baseUrl);
    });
  },
  saveCookie: (lineId, setCookie) => {
    const path = './api/storage/' + lineId + '.json';
    fs.writeFileSync(path, JSON.stringify({
      setCookie,
    }));
  }
}