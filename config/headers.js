module.exports = {
  Hapi    : require('hapi'),
  line    : require('@line/bot-sdk'),
  fs      : require('fs'),
  crypto  : require('crypto'),
  request : require('request'),
  cheerio : require('cheerio'),
  Promise : require('bluebird'),
  FCS     : require('tough-cookie-filestore'),
};
