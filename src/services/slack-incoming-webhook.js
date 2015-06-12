'use strict';

let _ = require('lodash');
let co = require('co');
let KindaObject = require('kinda-object');
let KindaLog = require('kinda-log');
let httpClient = require('kinda-http-client').create();

let SlackIncomingWebhookService = KindaObject.extend('SlackIncomingWebhookService', function() {
  this.creator = function(options = {}) {
    _.defaults(options, { channel: '#general' });
    if (!options.sender) throw new Error('sender is missing');
    if (!options.url) throw new Error('url is missing');

    this.url = options.url;
    this.channel = options.channel;
    this.username = options.sender;
    let log = options.log;
    if (!KindaLog.isClassOf(log)) log = KindaLog.create(log);
    this.log = log;
  };

  this.send = function(message) {
    co(function *() {
      let payload = {
        channel: this.channel,
        username: this.username,
        text: '<!channel> ' + message
      };
      let result = yield httpClient.post({ url: this.url, body: payload, json: true });
      if (result.body !== 'ok') {
        this.log.error(new Error(`an error occured while sending a Slack notification (${result.body})`));
      }
    }.bind(this)).catch(function(err) {
      this.log.error(err.stack || err);
    }.bind(this));
  };
});

module.exports = SlackIncomingWebhookService;
