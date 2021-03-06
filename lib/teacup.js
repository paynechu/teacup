// Generated by CoffeeScript 1.7.1
(function() {
  var Teacup, bind, bound, doctypes, elements, elems, hyphens, key, mergeElements, refer, teacup, _fn,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  doctypes = {
    'default': '<!DOCTYPE html>',
    '5': '<!DOCTYPE html>',
    'xml': '<?xml version="1.0" encoding="utf-8" ?>',
    'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
    'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
    '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
    'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',
    'ce': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "ce-html-1.0-transitional.dtd">'
  };

  elements = {
    regular: 'a abbr address article aside audio b bdi bdo blockquote body button canvas caption cite code colgroup datalist dd del details dfn div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins kbd label legend li map mark menu meter nav noscript object ol optgroup option output p pre progress q rp rt ruby s samp section select small span strong sub summary sup table tbody td textarea tfoot th thead time title tr u ul video ngChange ngForm ngInclude ngPluralize ngView',
    raw: 'script style',
    "void": 'area base br col command embed hr img input keygen link meta param source track wbr',
    obsolete: 'applet acronym bgsound dir frameset noframes isindex listing nextid noembed plaintext rb strike xmp big blink center font marquee multicol nobr spacer tt',
    obsoleteVoid: 'basefont frame'
  };

  mergeElements = function() {
    var a, args, element, result, _i, _j, _len, _len1, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    result = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      a = args[_i];
      _ref = elements[a].split(' ');
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        element = _ref[_j];
        if (__indexOf.call(result, element) < 0) {
          result.push(element);
        }
      }
    }
    return result;
  };

  hyphens = function(s) {
    return s.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
  };

  Teacup = (function() {
    function Teacup() {
      this._htmlOut = null;
    }

    Teacup.prototype._resetBuffer = function(html) {
      var previous;
      if (html == null) {
        html = null;
      }
      previous = this._htmlOut;
      this._htmlOut = html;
      return previous;
    };

    Teacup.prototype.render = function() {
      var args, previous, result, template;
      template = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      previous = this._resetBuffer('');
      try {
        template.apply(null, args);
      } finally {
        result = this._resetBuffer(previous);
      }
      return result;
    };

    Teacup.prototype.cede = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.render.apply(this, args);
    };

    Teacup.prototype.renderable = function(template) {
      var self;
      self = this;
      return function() {
        var args, result;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (self._htmlOut === null) {
          self._htmlOut = '';
          try {
            template.apply(this, args);
          } finally {
            result = self._resetBuffer();
          }
          return result;
        } else {
          return template.apply(this, args);
        }
      };
    };

    Teacup.prototype._renderAttr = function(name, value) {
      var k, v;
      name = hyphens(name);
      if (value == null) {
        return " " + name;
      }
      if (value === false) {
        return '';
      }
      if (name === 'data' && typeof value === 'object') {
        return ((function() {
          var _results;
          _results = [];
          for (k in value) {
            v = value[k];
            _results.push(this._renderAttr("data-" + k, v));
          }
          return _results;
        }).call(this)).join('');
      }
      if (value === true) {
        value = name;
      }
      return " " + name + "=" + (this.quote(this.escape(value.toString())));
    };

    Teacup.prototype._attrOrder = ['id', 'class'];

    Teacup.prototype._renderAttrs = function(obj) {
      var name, result, value, _i, _len, _ref;
      result = '';
      _ref = this._attrOrder;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (!(name in obj)) {
          continue;
        }
        result += this._renderAttr(name, obj[name]);
        delete obj[name];
      }
      for (name in obj) {
        value = obj[name];
        result += this._renderAttr(name, value);
      }
      return result;
    };

    Teacup.prototype._renderContents = function(contents) {
      var c, _i, _len, _results;
      if (contents == null) {

      } else if (Array.isArray(contents)) {
        _results = [];
        for (_i = 0, _len = contents.length; _i < _len; _i++) {
          c = contents[_i];
          _results.push(this._renderContents(c));
        }
        return _results;
      } else if (typeof contents === 'function') {
        return contents.call(this);
      } else {
        return this.text(contents);
      }
    };

    Teacup.prototype._isSelector = function(string) {
      var _ref;
      return string.length > 1 && ((_ref = string[0]) === '#' || _ref === '.');
    };

    Teacup.prototype._parseSelector = function(selector) {
      var classes, id, klass, token, _i, _len, _ref, _ref1;
      id = null;
      classes = [];
      _ref = selector.split('.');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        if (id) {
          classes.push(token);
        } else {
          _ref1 = token.split('#'), klass = _ref1[0], id = _ref1[1];
          if (klass !== '') {
            classes.push(token);
          }
        }
      }
      return {
        id: id,
        classes: classes
      };
    };

    Teacup.prototype._normalizeArgs = function(args) {
      var arg, attrs, classes, contents, id, index, selector, _i, _len;
      attrs = {};
      selector = null;
      contents = [];
      for (index = _i = 0, _len = args.length; _i < _len; index = ++_i) {
        arg = args[index];
        if (arg != null) {
          switch (typeof arg) {
            case 'string':
              if (index === 0 && this._isSelector(arg)) {
                selector = this._parseSelector(arg);
              } else {
                contents.push(arg);
              }
              break;
            case 'function':
            case 'number':
            case 'boolean':
              contents.push(arg);
              break;
            case 'object':
              if (arg.constructor === Object) {
                attrs = arg;
              } else {
                contents.push(arg);
              }
              break;
            default:
              contents.push(arg);
          }
        }
      }
      if (selector != null) {
        id = selector.id, classes = selector.classes;
        if (id != null) {
          attrs.id = id;
        }
        if (classes != null ? classes.length : void 0) {
          attrs["class"] = classes.join(' ');
        }
      }
      return {
        attrs: attrs,
        contents: contents
      };
    };

    Teacup.prototype.tag = function() {
      var args, attrs, contents, tagName, _ref;
      tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      tagName = hyphens(tagName);
      _ref = this._normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
      this.raw("<" + tagName + (this._renderAttrs(attrs)) + ">");
      this._renderContents(contents);
      return this.raw("</" + tagName + ">");
    };

    Teacup.prototype.rawTag = function() {
      var args, attrs, contents, tagName, _ref;
      tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      tagName = hyphens(tagName);
      _ref = this._normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
      this.raw("<" + tagName + (this._renderAttrs(attrs)) + ">");
      this.raw(contents);
      return this.raw("</" + tagName + ">");
    };

    Teacup.prototype.selfClosingTag = function() {
      var args, attrs, contents, tagName, _ref;
      tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      tagName = hyphens(tagName);
      _ref = this._normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
      if (contents.length) {
        throw new Error("Teacup: <" + tagName + "/> must not have content.  Attempted to nest " + contents);
      }
      return this.raw("<" + tagName + (this._renderAttrs(attrs)) + " />");
    };

    Teacup.prototype.coffeescript = function(fn) {
      return this.raw("<script type=\"text/javascript\">(function() {\n  var __slice = [].slice,\n      __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },\n      __hasProp = {}.hasOwnProperty,\n      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n  (" + (fn.toString()) + ")();\n})();</script>");
    };

    Teacup.prototype.comment = function(text) {
      return this.raw("<!--" + (this.escape(text)) + "-->");
    };

    Teacup.prototype.doctype = function(type) {
      if (type == null) {
        type = 5;
      }
      return this.raw(doctypes[type]);
    };

    Teacup.prototype.ie = function(condition, contents) {
      this.raw("<!--[if " + (this.escape(condition)) + "]>");
      this._renderContents(contents);
      return this.raw("<![endif]-->");
    };

    Teacup.prototype.text = function(s) {
      if (this._htmlOut == null) {
        throw new Error("Teacup: can't call a tag function outside a rendering context");
      }
      return this._htmlOut += (s != null) && this.escape(s.toString()) || '';
    };

    Teacup.prototype.raw = function(s) {
      return this._htmlOut += s;
    };

    Teacup.prototype.escape = function(text) {
      return text.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    Teacup.prototype.quote = function(value) {
      return "\"" + value + "\"";
    };

    return Teacup;

  })();

  teacup = new Teacup;

  bound = {};

  bind = function(tags, refer) {
    var tag, _fn, _i, _len;
    _fn = function(tag, refer) {
      Teacup.prototype[tag] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        args.unshift(tag);
        return teacup[refer].apply(teacup, args);
      };
      return bound[tag] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return teacup[tag].apply(teacup, args);
      };
    };
    for (_i = 0, _len = tags.length; _i < _len; _i++) {
      tag = tags[_i];
      _fn(tag, refer);
    }
    return bound;
  };

  bound.bind = bind;

  _fn = function(key) {
    if (key.indexOf('_') !== 0) {
      return bound[key] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return teacup[key].apply(teacup, args);
      };
    }
  };
  for (key in teacup) {
    _fn(key);
  }

  elems = {
    tag: mergeElements('regular', 'obsolete'),
    rawTag: mergeElements('raw'),
    selfClosingTag: mergeElements('void', 'obsoleteVoid')
  };

  for (refer in elems) {
    bind(elems[refer], refer);
  }

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = bound;
    module.exports.Teacup = Teacup;
  } else if (typeof define === 'function' && define.amd) {
    define('teacup', [], bound);
  } else {
    window.teacup = bound;
    window.teacup.Teacup = Teacup;
  }

}).call(this);

//# sourceMappingURL=teacup.map
