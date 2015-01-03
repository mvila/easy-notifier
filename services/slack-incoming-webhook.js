"use strict";

var co = require('co');
var log = require('kinda-log').create();
var httpClient = require('kinda-http-client').create();

var Service = {
  create: function(sender, options) {
    if (!sender) throw new Error('sender is missing');
    if (!options) options = {};
    if (!options.url) throw new Error('url is missing');

    var service = {};

    service.url = options.url;
    service.channel = options.channel || '#general';
    service.username = sender;

    service.send = function(message) {
      co(function *() {
        var payload = {
          channel: this.channel,
          username: this.username,
          text: '<!channel> ' + message
        };
        var result = yield httpClient.post(this.url, payload);
        if (result.body !== 'ok') {
          log.error(new Error('an error occured while sending a Slack notification (' + result.body + ')'));
        }
      }.bind(this)).catch(function(err) {
        log.error(err.stack);
      });
    };

    return service;
  }
};

module.exports = Service;
