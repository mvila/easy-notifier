'use strict';

let _ = require('lodash');
let co = require('co');
let KindaObject = require('kinda-object');
let KindaLog = require('kinda-log');
let util = require('kinda-util').create();

let KindaNotifier = KindaObject.extend('KindaNotifier', function() {
  this.creator = function(options = {}) {
    _.defaults(options, { hostName: util.getHostName() });

    let sender = options.sender;
    if (!sender) {
      sender = _.compact([options.appName, options.hostName]).join('@');
    }
    this.sender = sender;

    if (!options.targets) {
      let target = KindaNotifier.NodeNotifierTarget.create();
      options.targets = [target];
    }

    this.targets = options.targets;

    let log = options.log;
    if (!KindaLog.isClassOf(log)) log = KindaLog.create(log);
    this.log = log;
  };

  this.addTarget = function(target) {
    this.targets.push(target);
  };

  this.send = function(title, message) {
    co(function *() {
      yield this.sendAndWaitUntilCompleted(title, message);
    }.bind(this)).catch(err => {
      this.log.error(err.stack || err);
    });
  };

  this.sendAndWaitUntilCompleted = function *(title, message) {
    if (!message) {
      message = title;
      title = undefined;
    }
    if (!message) throw new Error('a \'message\' is required');
    for (let target of this.targets) {
      yield target.send(this.sender, title, message);
    }
  };
});

KindaNotifier.SlackIncomingWebhookTarget = require('./targets/slack-incoming-webhook');
KindaNotifier.NodeNotifierTarget = require('./targets/node-notifier');

module.exports = KindaNotifier;
