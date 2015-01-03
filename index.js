'use strict';

var os = require('os');
var _ = require('lodash');
var KindaObject = require('kinda-object');
var mainConfig = require('kinda-config').create();
var moduleConfig = require('kinda-config').get('kinda-notification');

var KindaNotification = KindaObject.extend('KindaNotification', function() {
  this.setCreator(function(localConfig) {
    var config = moduleConfig;
    if (localConfig) {
      config = _.cloneDeep(config);
      _.merge(config, localConfig, function(a, b) { // don't merge arrays
        return _.isArray(a) || _.isArray(b) ? b : undefined;
      });
    }
    this.config = config;
    this.sender = config.sender || mainConfig.name + '@' + os.hostname();
  });

  this._services = {}; // Shared across all instances

  this.registerService = function(name, service) {
    this._services[name] = service;
  };

  this.getService = function(name) {
    var service = this._services[name];
    if (!service) throw new Error("unknown service '" + name + "'");
    return service;
  };

  this.registerService(
    'slack-incoming-webhook',
    require('./services/slack-incoming-webhook')
  );

  this._serviceInstanceRecords = []; // Shared across all instances

  this.getServiceInstance = function(name, sender, options) {
    var instanceRecord = _.find(this._serviceInstanceRecords, function(record) {
      return (
        record.name === name &&
        record.sender === sender &&
        _.isEqual(record.options, options)
      );
    });
    if (instanceRecord) return instanceRecord.instance;
    var service = this.getService(name);
    var instance = service.create(sender, options);
    instanceRecord = {
      name: name,
      sender: sender,
      options: options,
      instance: instance
    };
    this._serviceInstanceRecords.push(instanceRecord);
    return instance;
  };

  this.send = function(message) {
    if (!this.config.targets) return;
    this.config.targets.forEach(function(target) {
      var instance = this.getServiceInstance(
        target.service, this.sender, target.options
      );
      instance.send(message);
    }.bind(this));
  };
});

module.exports = KindaNotification;
