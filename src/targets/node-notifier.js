'use strict';

let KindaObject = require('kinda-object');
let notifier = require('node-notifier');

let NodeNotifierTarget = KindaObject.extend('NodeNotifierTarget', function() {
  this.send = function *(sender, message) {
    notifier.notify({ title: sender, message });
  };
});

module.exports = NodeNotifierTarget;
