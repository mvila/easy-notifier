'use strict';

let _ = require('lodash');
let KindaObject = require('kinda-object');
let KindaLog = require('kinda-log');
let httpClient = require('kinda-http-client').create();

let SlackIncomingWebhookTarget = KindaObject.extend('SlackIncomingWebhookTarget', function() {
  this.creator = function(options = {}) {
    _.defaults(options, { channel: '#general' });
    if (!options.url) throw new Error('url is missing');

    this.url = options.url;
    this.channel = options.channel;
    let log = options.log;
    if (!KindaLog.isClassOf(log)) log = KindaLog.create(log);
    this.log = log;
  };

  this.send = function *(sender, title, message) {
    if (title) message = `*${title}*: ${message}`;
    let payload = {
      channel: this.channel,
      username: sender,
      text: '<!channel> ' + message
    };
    let result = yield httpClient.post({ url: this.url, body: payload, json: true });
    if (result.body !== 'ok') {
      this.log.error(new Error(`an error occured while sending a Slack notification (${result.body})`));
    }
  };
});

module.exports = SlackIncomingWebhookTarget;
