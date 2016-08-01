var _ = require('underscore'),

    AppDispatcher = require('./app_dispatcher'),
    Events = require('./events'),

    download = require('./actions/download'),
    log = require('./actions/log');

var addStyle = function (options, callback) {
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');

  if (options.content) {
    style.innerHTML = options.content;
    document.body.appendChild(style);

    callback(options);
    return ;
  }

  if (options.url) {
    download(options.url, {
      success: function (content) {
        style.innerHTML = content;
        options.content = content;

        document.body.appendChild(style);
        callback(options);
      }
    });

    return ;
  }
};

var Styles = function () {
  log('info', 'Start initializing Styles.');

  this.list = [];

  this.all = function () {
    return this.list;
  };

  this.add = function (style) {
    var _this = this;

    addStyle(_.clone(style), function () {
      _this.list.push(style);
    });
  };

  this.remove = function (style) {
    this.list = _.without(this.list, style);
  };

  this.load = function (onReadyCallback) {
    var _this = this;

    AppDispatcher.bind(Events.installStyle, function (style) {
      _this.add(style);
    });

    onReadyCallback();
  };

  log('info', 'Finish initializing Styles.');
};

module.exports = Styles;
