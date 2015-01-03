'use strict';

var os = require('os');
var _ = require('lodash');
var config = require('kinda-config').create();

var moduleConfig = require('kinda-config').get('kinda-notification');

var sender = moduleConfig.sender || config.name + '@' + os.hostname();

var kindaNotification = {};

kindaNotification.registerService = function(name, service) {
  if (!this._services) this._services = {};
  this._services[name] = service;
};

kindaNotification.registerService(
  'slack-incoming-webhook',
  require('./services/slack-incoming-webhook')
);

kindaNotification.getService = function(name) {
  var service = this._services[name];
  if (!service) throw new Error("unknown service '" + name + "'");
  return service;
};

kindaNotification.getServiceInstance = function(name, options) {
  if (!this._serviceInstanceRecords) this._serviceInstanceRecords = [];
  var instanceRecord = _.find(this._serviceInstanceRecords, function(service) {
    return service.name === name && _.isEqual(service.options, options);
  });
  if (instanceRecord) return instanceRecord.instance;
  var service = this.getService(name);
  var instance = service.create(sender, options);
  instanceRecord = {
    name: name,
    options: options,
    instance: instance
  };
  this._serviceInstanceRecords.push(instanceRecord);
  return instance;
};

kindaNotification.send = function(message) {
  if (!moduleConfig) return;
  var targets = moduleConfig.targets;
  if (!targets) return;
  targets.forEach(function(target) {
    var instance = this.getServiceInstance(target.service, target.options);
    instance.send(message);
  }.bind(this));
};

var KindaNotification = {
  create: function() {
    return kindaNotification;
  }
};

module.exports = KindaNotification;
