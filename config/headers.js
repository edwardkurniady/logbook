module.exports = {
  Hapi    : require('hapi'),
  line    : require('@line/bot-sdk'),
  fs      : require('fs'),
  crypto  : require('crypto'),
  request : require('request'),
  cheerio : require('cheerio'),
  Promise : require('bluebird'),
  HapiCron: require('hapi-cron'),
  Glue    : require('glue'),
  moment  : require('moment-timezone'),
};
