var React = require('react'),
    moment = require('moment'),
    _ = require('underscore'), 
    OS = require('os'),

    Widget = OS.Widget,
    Mixins = OS.Mixins,
    AppDispatcher= OS.AppDispatcher,

    settings = require('./settings'),
    Configurator = require('./configurator');

var _Widget = React.createClass({
  mixins: [Mixins.WidgetHelper],

  getDefaultProps: function () {
    return {
      name: settings.WIDGET_NAME,
      configuratorRefName: settings.CONFIGURATOR_REF_NAME
    };
  },

  getInitialState: function () {
    return {
      _moment: moment(),
      format: settings.DEFAULT_FORMAT,
      updatedInterval: settings.DEFAULT_UPDATED_INTERVAL,

      size: settings.DEFAULT_SIZE,
      position: settings.DEFAULT_POSITION,
      widgetStyles: settings.DEFAULT_WIDGET_STYLES,
      timeStyles: settings.DEFAULT_TIME_STYLES
    };
  },

  setSettings: function (settings) {
    this.setState({
      format: settings.format,
      updatedInterval: settings.updatedInterval,

      size: settings.size,
      position: settings.position,
      timeStyles: settings.timeStyles
    }, function () {
      this.refreshInterval();
      this.save();
    });
  },

  getSettings: function () {
    return {
      format: this.state.format,
      updatedInterval: this.state.updatedInterval,

      size: _.clone(this.state.size),
      position: _.clone(this.state.position),
      timeStyles: _.clone(this.state.timeStyles)
    };
  },

  getTime: function () {
    return this.state._moment.format(
      this.state.format
    );
  },

  refreshInterval: function () {
    this.clearInterval();
    this.setInterval();
  },

  setInterval: function () {
    var intervalId = setInterval(
      this.updateMoment,
      this.state.updatedInterval
    );
    this.setState({ intervalId: intervalId });
  },

  clearInterval: function () {
    clearInterval(this.state.intervalId);
  },

  updateMoment: function () {
    this.setState({
      _moment: moment()
    });
  },

  componentWillMount: function () {
    this.init();
  },

  componentDidMount: function () {
    this.setInterval();
  },

  componentWillUnmount: function () {
    this.clearInterval();
  },

  render: function () {
    return (
      <Widget.Widget widgetStyles={ this.getWidgetStyles() }>
        <Widget.DefaultIconsContainer
          onMouseDownPositionBtn={ this.handleStartMoving }
          onClickCloseBtn={ this.close }
          onClickConfigureBtn={ this.openConfigurator }
        />

        <Widget.Body>
          <div style={ this.state.timeStyles }>
            { this.getTime() }
          </div>
        </Widget.Body>

        <Configurator
          ref={ this.props.configuratorRefName }
          name={ this.props.name }
          settings={ this.getSettings() }
          onSubmit={ this.handleConfigure }
        />
      </Widget.Widget>
    );
  }
});

module.exports = _Widget;
