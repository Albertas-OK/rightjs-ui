/**
 * This class handles the selection ranges
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Selection = new Class({

  /**
   * Basic constructor
   */
  initialize: function() {
    this.range = null;
  },

  /**
   * Returns current selected text range
   *
   * @return TextRange range
   */
  get: function() {
    try { // W3C
      return window.getSelection().getRangeAt(0);
    } catch(e) {
      try { // IE
        return document.selection.createRange();
      } catch (e) { // Safari
        var selection = window.getSelection(), range = document.createRange();
        if (selection.focusNode) {
          range.setStart(selection.anchorNode, selection.anchorOffset);
          range.setEnd(selection.focusNode, selection.focusOffset);
        }
        return range;
      }
    }
  },

  /**
   * Sets the selection by range
   *
   * @param TextRange range
   * @return void
   */
  set: function(range) {
    if (range.select) {  // IE
      range.select();
    } else { // w3c
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  /**
   * Saves the current selection range
   *
   * @return void
   */
  save: function() {
    this.range = this.get();
  },

  /**
   * Restores previously stored selection range
   *
   * @return void
   */
  restore: function() {
    if (this.range !== null) {
      this.set(this.range);
    }
  },

  /**
   * Returns the dom-node that's currently in focus
   *
   * @return raw dom-node
   */
  node: function() {
    var range = this.get(), node;

    if (range.startContainer) {
      // getting the basic common container
      node = range.commonAncestorContainer;

      // if there is a selection trying those
      if (!range.collapsed) {
        if (
          range.startContainer == range.endContainer &&
          range.startOffset - range.endOffset < 2    &&
          range.startContainer.hasChildNodes()
        ) {
          node = range.startContainer.childNodes[range.startOffset];
        }
      }

      node = node && node.nodeType === 3 ? node.parentNode : node;
    } else {
      node = range.item ? range.item(0) : range.parentElement();
    }

    return node;
  },

  /**
   * Puts current selection over the given raw dom-node
   *
   * @param raw dom-node
   * @return void
   */
  wrap: function(element) {
    var range = this.get();

    if (range.setStart) {
      range.selectNode(element);
      this.set(range);
    } else {
      // TODO IE version
    }
  },

  /**
   * Returns the selection text
   *
   * @return String selection text
   */
  text: function() {
    var text = this.get();
    return '' + (text.text ? text.text : text);
  },

  /**
   * Cheks if the selection is empty
   *
   * @return boolean check result
   */
  empty: function() {
    return this.text() == '';
  },

  /**
   * Returns the HTML content of the selection
   *
   * @return String html content
   */
  html: function() {
    var range = this.get(), tmp, fragment;

    if (range.htmlText) {
      return range.htmlText;
    } else {
      tmp = document.createElement('div');
      fragment = range.cloneContents();

      while (fragment.firstChild) {
        tmp.appendChild(fragment.firstChild);
      }

      return tmp.innerHTML;
    }
  }
});