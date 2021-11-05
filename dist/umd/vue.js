(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var oldArrayMethods = Array.prototype;
  var protoMethods = Object.create(oldArrayMethods);
  var methods = ['pop', 'push', 'unshift', 'shift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    protoMethods[method] = function () {
      var inserted = null;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      }

      this.__ob__.arrayObserver(inserted);

      return oldArrayMethods[method].apply(this, args); //执行原方法逻辑
    };
  });

  function defineProperty(target, attr, value) {
    Object.defineProperty(target, attr, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }
  function proxy(target, data) {
    var _loop = function _loop(key) {
      Object.defineProperty(target, key, {
        get: function get() {
          return data[key];
        },
        set: function set(newValue) {
          data[key] = newValue;
        }
      });
    };

    for (var key in data) {
      _loop(key);
    }
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      defineProperty(data, '__ob__', this); //做标记, 是否观测过

      if (Array.isArray(data)) {
        data.__proto__ = protoMethods; //对数组的方法进行拦截

        this.arrayObserver(data); //对数组中的对象类型进行观测
      } else {
        this.walk(data);
      } //所有的逻辑放在构造函数里,太臃肿, 封装到一个方法中去做代理

    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "arrayObserver",
      value: function arrayObserver(arr) {
        arr.forEach(function (item) {
          observer(item);
        });
      }
    }]);

    return Observer;
  }(); // 对原有data(数据对象进行改造, 全部给setter,getter)
  // 使用闭包 用value保存data[key]的值
  // 当访问data的属性时, 实际上访问和修改的是闭包value中的值


  function defineReactive(data, key, value) {
    observer(value); //如果对象的属性值仍为对象, 递归!

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        observer(newValue); //如果修改的属性依然为对象, 递归!

        value = newValue;
      }
    });
  }

  function observer(data) {
    // 在js中typeof null 也是object
    if (_typeof(data) !== 'object' || typeof data === null) {
      return;
    }

    if (data.__ob__) {
      return;
    } // 真正的处理data, 放在一个类里, 封装性比较好


    new Observer(data);
  }

  function initState(vm) {
    initData(vm);
  }

  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data; //对data是函数的情况执行处理,保证this是vm
    //开始数据劫持

    observer(data); //数据代理

    proxy(vm, vm._data);
  }

  // 匹配标签属性, 三个分组, 第一个分组是属性名, 第二个分组是等号, 第三四五个分组是属性名(分别对应着"" '' 和没有引号)
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配标签名

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 匹配命名空间标签名

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 匹配开始标签的左尖括号

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配结束标签的右标签 >

  var startTagClose = /^\s*(\/?)>/; // 匹配结束标签 </div>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  function htmlParser(html) {
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        attrs: attrs,
        children: [],
        parent: null
      };
    }

    var root;
    /* 根节点 */

    var currentParent;
    /* 当前父节点 */

    var stack = [];
    /* 栈 */

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }
    /* 栈帧顶部是子节点, 下一层是顶部节点的父节点 */


    function end() {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, '');
      currentParent.children.push({
        type: 3,
        text: text
      });
    }

    function advance(n) {
      html = html.substring(n);
    }

    while (html) {
      var textEnd = html.indexOf('<'); //如果<的下标是0则代表是标签, 如果不是则代表是文本

      if (textEnd == 0) {
        var startMatch = parseStartTag();

        if (startMatch) {
          start(startMatch.tagName, startMatch.attrs);
          continue;
        }

        var endMatch = html.match(endTag);

        if (endMatch) {
          end(endMatch[1]);
          advance(endMatch[0].length);
          continue;
        }
      }

      var text = null;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        var attr = null;
        var _end = null;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
            /* 3,4,5均是属性, 分别对应双引号,单引号,无引号写法 */

          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }
    }

    return root;
  }

  // 匹配mustache语法 {{}}
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 解析属性

  function genProps(attrs) {
    var str = '';

    for (var i = 0, attr; attr = attrs[i++];) {
      if (attr.name === 'style') {
        (function () {
          var obj = {}; //attr.name示例 "color:red;height:200px"

          attr.value.split(';').forEach(function (item) {
            //解构赋值,示例: let [key,value]=['color','red']
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}"); //去除字符传最后的逗号
  }

  function genChildren(children) {
    if (!children) return; // 区分不同的child节点, 做不同的处理,(成字符串)

    return children.map(function (child) {
      return gen(child);
    }).join(',');
  }

  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } // node === 3时


    var text = node.text;

    if (!defaultTagRE.test(text)) {
      return "_v(".concat(JSON.stringify(text), ")");
    } else {
      // 当有mustache语法时{{}}
      var lastIndex = defaultTagRE.lastIndex = 0;
      var match, index;
      var tokens = [];

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (lastIndex < index) {
          tokens.push("".concat(JSON.stringify(text.slice(lastIndex, index))));
          lastIndex = match[0].length + index;
        }

        tokens.push("".concat(match[1].trim()));
      } // 当匹配完成时, 还有可能后面有字符串


      if (text.length > lastIndex) {
        tokens.push("".concat(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(ast) {
    var code = "";
    var attrs = ast.attrs;
    var children = ast.children; // 目标字符串: '_c('div',{ id:'box',style:{ color:'red' } },_v('hello'+name),_c('div',undefined,_v('你好,李银河'))'

    code = "_c(\"".concat(ast.tag, "\",").concat(attrs.length ? genProps(attrs) : 'undefined', ",").concat(children ? genChildren(children) : '', ")");
    return code;
  }

  function compileToFunctions(template) {
    var ast = htmlParser(template); //生成AST语法树

    var code = generate(ast); //生成render函数备用code字符串

    var render = new Function("with(this){".concat(code, "}"));
    return render;
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 对做响应式!

      initState(vm); // 模板渲染

      if (this.$options.el) {
        this.$mount(this.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var options = this.$options;
      el = document.querySelector(el);
      var template = options.template; //假设有template

      if (!options.render) {
        if (el && !options.template) {
          template = el.outerHTML;
        }
      }

      var render = compileToFunctions(template);
      console.log(render);
      options.render = render;
    };
  }

  function Vue(options) {
    this.$options = options;

    this._init(options);
  }

  initMixin(Vue); //公共方法挂载原型上

  return Vue;

}));
//# sourceMappingURL=vue.js.map
