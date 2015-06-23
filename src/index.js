'use strict';

let os = require('os');
let _ = require('lodash');
let co = require('co');
let KindaObject = require('kinda-object');
let KindaLog = require('kinda-log');

let hostName = os.hostname();
if (_.endsWith(hostName, '.local')) {
  hostName = hostName.slice(0, -('.local'.length));
}

let KindaNotifier = KindaObject.extend('KindaNotifier', function() {
  this.creator = function(options = {}) {
    _.defaults(options, { hostName, targets: [] });
    let sender = options.sender;
    if (!sender) {
      sender = _.compact([options.appName, options.hostName]).join('@');
    }
    this.sender = sender;
    this.targets = options.targets;

    let log = options.log;
    if (!KindaLog.isClassOf(log)) log = KindaLog.create(log);
    this.log = log;
  };

  this.addTarget = function(target) {
    this.targets.push(target);
  };

  this.send = function(message) {
    co(function *() {
      yield this.sendAndWaitUntilCompleted(message);
    }.bind(this)).catch(err => {
      this.log.error(err.stack || err);
    });
  };

  this.sendAndWaitUntilCompleted = function *(message) {
    for (let target of this.targets) {
      yield target.send(this.sender, message);
    }
  };
});

KindaNotifier.SlackIncomingWebhookTarget = require('./targets/slack-incoming-webhook');

module.exports = KindaNotifier;
