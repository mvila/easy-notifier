'use strict';

let os = require('os');
let _ = require('lodash');
let KindaObject = require('kinda-object');
let KindaLog = require('kinda-log');

let hostName = os.hostname();
if (_.endsWith(hostName, '.local')) {
  hostName = hostName.slice(0, -('.local'.length));
}

let KindaNotification = KindaObject.extend('KindaNotification', function() {
  this.creator = function(options = {}) {
    _.defaults(options, { hostName, targets: [] });
    let sender = options.sender;
    if (!sender) {
      sender = _.compact([options.applicationName, options.hostName]).join('@');
    }
    this.sender = sender;
    this.targets = options.targets;

    let log = options.log;
    if (!KindaLog.isClassOf(log)) log = KindaLog.create(log);
    this.log = log;
  };

  this._services = {}; // Shared across all instances

  this.getService = function(name) {
    let service = this._services[name];
    if (!service) throw new Error(`unknown service '${name}'`);
    return service;
  };

  this.addService = function(name, service) {
    this._services[name] = service;
  };

  this.addService(
    'slack-incoming-webhook', require('./services/slack-incoming-webhook')
  );

  this.getServiceInstance = function(name, options) {
    if (!this._serviceInstanceRecords) this._serviceInstanceRecords = [];
    let instanceRecord = _.find(this._serviceInstanceRecords, record => {
      return record.name === name && _.isEqual(record.options, options);
    });
    if (instanceRecord) return instanceRecord.instance;
    let service = this.getService(name);
    let opts = _.clone(options);
    opts.sender = this.sender;
    opts.log = this.log;
    let instance = service.create(opts);
    instanceRecord = { name, options, instance };
    this._serviceInstanceRecords.push(instanceRecord);
    return instance;
  };

  this.send = function(message) {
    this.targets.forEach(target => {
      let instance = this.getServiceInstance(target.service, target.options);
      instance.send(message);
    });
  };
});

module.exports = KindaNotification;
