/**
 * The actual Editor unit for the Rte
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Editor = new Class(Element, {

  /**
   * Basic constructor
   *
   * @param Rte rte
   * @return void
   */
  initialize: function(rte) {
    this.$super('div', {
      'class': 'rui-rte-editor',
      'contenteditable': true
    });

    this.rte = rte;

    var editor = this, selection = this.selection = new Rte.Selection();

    this.on({
      focus: function() {
        selection.restore();
        editor.focused = true;
        rte.fire('focus');
      },
      blur:    function() {
        editor.focused = false;
        rte.fire('blur');
      },
      mouseup: function() {
        selection.save();
        rte.status.update();
      },
      keyup:   function(event) {
        if (editor._isNav(event)) {
          selection.save();
          rte.status.update();
        }
      },
      keydown:  this._keydown,
      keypress: this._keypress
    });

    // setting up the styles mode
    this.exec('styleWithCSS', rte.options.styleWithCSS);
  },

  /**
   * Updates the editor's content
   *
   * @param String text
   * @return Rte.Editor this
   */
  update: function(text) {
    for (var key in Rte.Convert) {
      text = text.replace(
        new RegExp('<(\/)?'+ key +'>', 'ig'),
        '<$1'+ Rte.Convert[key] + '>'
      );
    }

    this._.innerHTML = text;

    return this;
  },

  /**
   * puts focus on the editing area
   *
   * @return Rte.Editor this
   */
  focus: function() {
    this._.focus();
    return this;
  },

  /**
   * removes focus out of the editing area
   *
   * @return Rte.Editor this
   */
  blur: function() {
    this._.blur();
    return this;
  },

  /**
   * executes a command on this editing area
   *
   * @param String command name
   * @param mixed command value
   * @return Rte.Editor this
   */
  exec: function(command, value) {
    try {
      // it throws errors in some cases in the non-design mode
      document.execCommand(command, false, value);
    } catch(e) {}

    return this;
  },

  /**
   * Queries the command state
   *
   * @param String command name
   * @return boolean check result
   */
  query: function(command) {
    try {
      return document.queryCommandState(command);
    } catch(e) {
      return false;
    }
  },

// protected

  // catches the keydown
  _keydown: function(event) {
    var raw = event._, key = raw.keyCode;

    if (raw.metaKey || raw.ctrlKey) {
      if (key in this.rte.shortcuts) {
        event.stop();
        this.rte.shortcuts[key].exec();
      }
    }
  },

  navigation_keys: [
    37,
    38,
    39,
    40,
    13
  ],

  _isNav: function(event) {
    return this.navigation_keys.indexOf(event._.keyCode) > -1;
  }

});