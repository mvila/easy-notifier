'use strict';

let KindaObject = require('kinda-object');
let KindaLog = require('kinda-log');
let util = require('kinda-util').create();

let KindaNotifier = KindaObject.extend('KindaNotifier', function() {
  // options:
  //   sender
  //   appName
  //   hostName
  //   targets
  //   includeEnvironment (default: true)
  //   log
  this.creator = function(options = {}) {
    let sender = options.sender;
    if (!sender) {
      let includeEnvironment = options.includeEnvironment;
      if (includeEnvironment == null) includeEnvironment = true;

      let appName = options.appName;
      if (includeEnvironment) {
        if (appName) appName += '.'; else appName = '';
        appName += util.getEnvironment();
      }

      let hostName = options.hostName;
      if (!hostName) hostName = util.getHostName();

      sender = appName;
      if (sender) sender += '@'; else sender = '';
      sender += hostName;
    }
    this.sender = sender;

    let targets = options.targets;
    if (!targets) {
      let target = KindaNotifier.NodeNotifierTarget.create();
      targets = [target];
    }
    this.targets = targets;

    let log = options.log;
    if (!KindaLog.isClassOf(log)) log = KindaLog.create(log);
    this.log = log;
  };

  this.addTarget = function(target) {
    this.targets.push(target);
  };

  this.send = function(title, message) {
    (async function() {
      await this.sendAndWaitUntilCompleted(title, message);
    }).call(this).catch(err => {
      this.log.error(err.stack || err);
    });
  };

  this.sendAndWaitUntilCompleted = async function(title, message) {
    if (!message) {
      message = title;
      title = undefined;
    }
    if (!message) throw new Error('a \'message\' is required');
    for (let target of this.targets) {
      await target.send(this.sender, title, message);
    }
  };
});

KindaNotifier.SlackIncomingWebhookTarget = require('./targets/slack-incoming-webhook');
KindaNotifier.NodeNotifierTarget = require('./targets/node-notifier');

module.exports = KindaNotifier;
