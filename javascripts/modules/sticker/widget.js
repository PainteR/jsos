var React = require('react'),

    OS = require('os'),
    Mixins = OS.Mixins,
    Widget = OS.Widget,

    IForm = OS.IForm,
    Textarea = OS.Textarea,

    Configurator = require('./configurator'),
    settings = require('./settings');

var _Widget = React.createClass({
  mixins: [Mixins.WidgetHelper],

  getInitialState: function () {
    return {
      value: '',

      size: settings.DEFAULT_SIZE,
      position: settings.DEFAULT_POSITION,
      widgetStyles: settings.DEFAULT_WIDGET_STYLES,

      textareaStyles: settings.DEFAULT_TEXTAREA_STYLES
    };
  },

  handleChange: function (value) {
    this.setState({
      value: value
    }, this.saveSettings);
  },

  getSettings: function () {
    return {
      value: this.state.value,

      size: _.clone(this.state.size),
      position: _.clone(this.state.position),
      widgetStyles: _.clone(this.state.widgetStyles),
      textareaStyles: _.clone(this.state.textareaStyles)
    };
  },

  componentWillMount: function () {
    this.init();
  },

  render: function () {
    return (
      <Widget.Widget widgetStyles={ this.getWidgetStyles() }>
        <Widget.DefaultIconsContainer
          onMouseDownPositionBtn={ this.handleStartMoving }
          onClickCloseBtn={ this.close }
          onClickConfigureBtn={ this._openConfigurator }
        />

          <IForm.Form
            style={ settings.FORM_STYLES }>

            <IForm.Field
              containerStyle={ settings.MESSAGE_FIELD_STYLES }
              labelText="message">

              <Textarea
                value={ this.state.value }
                onChange={ this.handleChange }
                style={ this.state.textareaStyles }
              />
            </IForm.Field>
          </IForm.Form>

      </Widget.Widget>
    );
  },

  createConfigurator: function () {
    return (
      <Configurator
        name={ this.getName() }
        settings={ this.getSettings() }
        onSubmit={ this._handleConfigure }
      />
    );
  }
});

module.exports = _Widget;
