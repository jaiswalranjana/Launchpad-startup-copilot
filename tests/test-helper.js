/**
 * Test Helper for LaunchPad Test Suite
 * Provides clean, lightweight DOM and Storage mocks for testing vanilla JS in Node.js
 */

const mockStorage = {};

globalThis.localStorage = {
  getItem: (k) => (Object.prototype.hasOwnProperty.call(mockStorage, k) ? mockStorage[k] : null),
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => {
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
  }
};

const elementsMap = new Map();

function createMockElement(id = '', tag = 'div') {
  return {
    id,
    tagName: tag.toUpperCase(),
    value: '',
    textContent: '',
    innerHTML: '',
    style: {},
    className: '',
    classList: {
      _classes: new Set(),
      add: function (...cls) { cls.forEach(c => this._classes.add(c)); },
      remove: function (...cls) { cls.forEach(c => this._classes.delete(c)); },
      toggle: function (c, force) {
        if (force === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (force) {
          this._classes.add(c);
        } else {
          this._classes.delete(c);
        }
      },
      contains: function (c) { return this._classes.has(c); }
    },
    attributes: {},
    setAttribute: function (name, val) { this.attributes[name] = String(val); },
    getAttribute: function (name) { return this.attributes[name] || null; },
    removeAttribute: function (name) { delete this.attributes[name]; },
    focus: function () { this._focused = true; },
    blur: function () { this._focused = false; },
    addEventListener: function () {},
    querySelectorAll: function () { return []; },
    querySelector: function () { return null; },
    appendChild: function () {},
    removeChild: function () {},
    closest: function () { return createMockElement(); }
  };
}

globalThis.document = {
  getElementById: (id) => {
    if (!elementsMap.has(id)) {
      elementsMap.set(id, createMockElement(id));
    }
    return elementsMap.get(id);
  },
  querySelectorAll: () => [],
  querySelector: () => null,
  createElement: (tag) => createMockElement('', tag),
  addEventListener: () => {}
};

globalThis.window = {
  addEventListener: () => {},
  scrollTo: () => {},
  print: () => {}
};

const copilot = require('../script.js');

module.exports = {
  copilot,
  mockStorage,
  createMockElement
};
