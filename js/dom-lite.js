/**
 * Minimal jQuery-compatible `$` used to drop the jQuery dependency.
 * Implements only the subset of the API used by story-effects.js / story-main.js:
 * selection, class/attr/css helpers, namespaced on/off/one/trigger, each, find, appendTo, remove.
 */
(function (global) {
  "use strict";

  var EXPANDO = "__dlListeners";

  function isElementLike(value) {
    return (
      value &&
      (value.nodeType === 1 ||
        value.nodeType === 9 ||
        value === global ||
        value === global.document)
    );
  }

  function toElementArray(input) {
    if (input == null) {
      return [];
    }
    if (input instanceof DomLite) {
      return input.toArray();
    }
    if (typeof input === "string") {
      var trimmed = input.trim();
      if (trimmed.charAt(0) === "<") {
        var template = global.document.createElement("template");
        template.innerHTML = trimmed;
        return Array.prototype.slice.call(template.content.childNodes);
      }
      return Array.prototype.slice.call(
        global.document.querySelectorAll(trimmed),
      );
    }
    if (isElementLike(input)) {
      return [input];
    }
    if (typeof input.length === "number") {
      return Array.prototype.slice.call(input);
    }
    return [input];
  }

  function parseEventSpec(spec) {
    var parts = spec.split(".");
    return { type: parts[0], namespace: parts.slice(1).join(".") };
  }

  function getListenerStore(el) {
    if (!el[EXPANDO]) {
      el[EXPANDO] = [];
    }
    return el[EXPANDO];
  }

  function addListener(el, type, namespace, handler) {
    el.addEventListener(type, handler);
    getListenerStore(el).push({
      type: type,
      namespace: namespace,
      handler: handler,
    });
  }

  function removeListeners(el, type, namespace) {
    var store = getListenerStore(el);
    for (var i = store.length - 1; i >= 0; i--) {
      var entry = store[i];
      var typeMatches = !type || entry.type === type;
      var namespaceMatches = !namespace || entry.namespace === namespace;
      if (typeMatches && namespaceMatches) {
        el.removeEventListener(entry.type, entry.handler);
        store.splice(i, 1);
      }
    }
  }

  function DomLite(input) {
    var elements = toElementArray(input);
    this.length = elements.length;
    for (var i = 0; i < elements.length; i++) {
      this[i] = elements[i];
    }
  }

  DomLite.prototype.toArray = function () {
    return Array.prototype.slice.call(this);
  };

  DomLite.prototype.each = function (callback) {
    for (var i = 0; i < this.length; i++) {
      callback.call(this[i], i, this[i]);
    }
    return this;
  };

  DomLite.prototype.on = function (events, handler) {
    events.split(/\s+/).forEach(function (spec) {
      var parsed = parseEventSpec(spec);
      this.each(function () {
        addListener(this, parsed.type, parsed.namespace, handler);
      });
    }, this);
    return this;
  };

  DomLite.prototype.one = function (events, handler) {
    events.split(/\s+/).forEach(function (spec) {
      var parsed = parseEventSpec(spec);
      this.each(function () {
        var el = this;
        var wrapped = function (e) {
          removeListeners(el, parsed.type, parsed.namespace);
          handler.call(el, e);
        };
        addListener(el, parsed.type, parsed.namespace, wrapped);
      });
    }, this);
    return this;
  };

  DomLite.prototype.off = function (events) {
    var specs = events ? events.split(/\s+/) : [""];
    specs.forEach(function (spec) {
      var parsed = parseEventSpec(spec);
      this.each(function () {
        removeListeners(this, parsed.type, parsed.namespace);
      });
    }, this);
    return this;
  };

  DomLite.prototype.trigger = function (type) {
    this.each(function () {
      var event;
      try {
        event = new Event(type, { bubbles: true, cancelable: true });
      } catch (e) {
        event = global.document.createEvent("Event");
        event.initEvent(type, true, true);
      }
      this.dispatchEvent(event);
    });
    return this;
  };

  DomLite.prototype.addClass = function (names) {
    var list = names.split(/\s+/);
    return this.each(function () {
      var el = this;
      list.forEach(function (name) {
        el.classList.add(name);
      });
    });
  };

  DomLite.prototype.removeClass = function (names) {
    var list = names.split(/\s+/);
    return this.each(function () {
      var el = this;
      list.forEach(function (name) {
        el.classList.remove(name);
      });
    });
  };

  DomLite.prototype.toggleClass = function (names) {
    var list = names.split(/\s+/);
    return this.each(function () {
      var el = this;
      list.forEach(function (name) {
        el.classList.toggle(name);
      });
    });
  };

  DomLite.prototype.hasClass = function (name) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].classList.contains(name)) {
        return true;
      }
    }
    return false;
  };

  DomLite.prototype.attr = function (name, value) {
    if (typeof name === "object") {
      return this.each(function () {
        var el = this;
        Object.keys(name).forEach(function (key) {
          el.setAttribute(key, name[key]);
        });
      });
    }
    if (value === undefined) {
      return this.length ? this[0].getAttribute(name) : null;
    }
    return this.each(function () {
      this.setAttribute(name, value);
    });
  };

  DomLite.prototype.removeAttr = function (name) {
    return this.each(function () {
      this.removeAttribute(name);
    });
  };

  DomLite.prototype.css = function (prop, value) {
    if (value === undefined) {
      return this.length
        ? global.getComputedStyle(this[0]).getPropertyValue(prop)
        : null;
    }
    return this.each(function () {
      this.style.setProperty(prop, value);
    });
  };

  DomLite.prototype.find = function (selector) {
    var found = [];
    this.each(function () {
      found = found.concat(
        Array.prototype.slice.call(this.querySelectorAll(selector)),
      );
    });
    return new DomLite(found);
  };

  DomLite.prototype.appendTo = function (target) {
    var container =
      target instanceof DomLite ? target[0] : toElementArray(target)[0];
    this.each(function () {
      if (container) {
        container.appendChild(this);
      }
    });
    return this;
  };

  DomLite.prototype.remove = function () {
    return this.each(function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    });
  };

  function $(input) {
    return new DomLite(input);
  }

  $.each = function (collection, callback) {
    var arr =
      collection instanceof DomLite ? collection : new DomLite(collection);
    for (var i = 0; i < arr.length; i++) {
      callback.call(arr[i], i, arr[i]);
    }
    return collection;
  };

  global.$ = $;
})(window);
