'use strict';

let KindaObject = require('kinda-object');
let notifier = require('node-notifier');

let NodeNotifierTarget = KindaObject.extend('NodeNotifierTarget', function() {
  this.send = async function(sender, title, message) {
    message += ` (${sender})`;
    let options = { message };
    if (title) options.title = title;
    notifier.notify(options);
  };
});

module.exports = NodeNotifierTarget;
