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

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++; // 订阅爹

      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // 当前watcher添加依赖(依赖收集)
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        // 通知watcher修改更新视图
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }]);

    return Dep;
  }();

  Dep.target = null; // 用来记录依赖所属的组件Watcher

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
  } // 定义策略模式

  var strategies = {};
  var LIFE_CYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdated', 'update', 'beforeDestroy', 'destroyed']; // 合并声明周期的逻辑

  LIFE_CYCLE_HOOKS.forEach(function (hook) {
    /* 
      核心逻辑: 1: 没有新配置, 直接返回老配置
               2:有新配置项, 没有老配置项 返回一个包装新配置项函数的数组
              3: 新老都有. 合并数组
    */
    strategies[hook] = function (oldFn, newFn) {
      if (newFn) {
        if (oldFn) {
          return oldFn.concat(newFn);
        } else {
          return [newFn];
        }
      } else {
        return oldFn;
      }
    };
  }); // 合并其他API的逻辑

  strategies.data = function (oldFn, newFn) {
    return newFn;
  }; // todo....


  function mergeOptions(oldOptions, newOptions) {
    var options = {}; // 遍历老配置项 如: option为created, 如果没有老配置(初始化的时候) 则不会走此循环,直接循环新配置项

    for (var option in oldOptions) {
      // 合并字段
      mergeField(option);
    } // 遍历 新配置项


    for (var _option in newOptions) {
      // 如果老配置项没有新配置项的属性
      if (!oldOptions.hasOwnProperty(_option)) {
        mergeField(_option);
      }
    }

    function mergeField(field) {
      // 调用不同的策略
      if (strategies[field]) {
        options[field] = strategies[field](oldOptions[field], newOptions[field]);
      } else {
        options[field] = newOptions[field];
      }
    }

    return options;
  }
  function pushTarget(watcher) {
    Dep.target = watcher;
  }
  function popTarget() {
    Dep.target = null;
  }

  function globalMixin(Vue) {
    // mixin的周期存在Vue.options中(缓存池)
    Vue.options = {};

    Vue.mixin = function (options) {
      // 合并配置项( 将原有的mixin和正在添加的新mixin合并 )
      this.options = mergeOptions(this.options, options);
    };
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

      var ret = oldArrayMethods[method].apply(this, args); //执行原方法逻辑

      this.__ob__.dep.notify(); // 通知更新视图


      return ret;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 为每个对象(包括数组)添加dep属性, 这样数组就有了dep
      this.dep = new Dep(); //做标记, 是否观测过以及保留指针

      defineProperty(data, '__ob__', this);

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
    var dep = new Dep(); // 每一个属性对应一个依赖

    var childDep = observer(value); //如果对象的属性值仍为对象, 递归!

    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          // 将依赖添加到组件Wacher中
          // 对属性做依赖收集
          dep.depend();

          if (childDep.dep) {
            // 对值做依赖收集
            childDep.dep.depend();
          }
        }

        return value;
      },
      set: function set(newValue) {
        observer(newValue); //如果修改的属性依然为对象, 递归!

        value = newValue; // 每当修改依赖数据, 通知观察者修改视图

        dep.notify();
      }
    });
  }

  function observer(data) {
    // 在js中typeof null 也是object
    if (_typeof(data) !== 'object' || typeof data === null) {
      return data;
    }

    if (data.__ob__) {
      return data;
    } // 真正的处理data, 放在一个类里, 封装性比较好


    return new Observer(data);
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

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = ''; // 循环属性

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; // 如果是 style 需要单独判断

      if (attr.name == 'style') {
        (function () {
          var obj = {}; // 通过 分割 ; 来讲 style 分成 数组

          attr.value.split(';').forEach(function (item) {
            // 再通过 分割 ： 将键值保存
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }
    /*  删除最后的 逗号， slice(start,end)
    start 必需。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。
    end	可选。规定从何处结束选取。如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。 */


    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      //将子元素用逗号拼接
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function gen(node) {
    if (node.type == 1) {
      // 元素
      return generate(node);
    } else {
      var text = node.text; // 不带 花括号的文本

      if (!defaultTagRE.test(text)) {
        // JSON.stringify 才能将 文本带上 双引号，不然就会被解析为 变量
        return "_v(".concat(JSON.stringify(text).trim(), ")");
      } // 带 花括号的文本需要单独判断  e{{a}} b {{c}} d


      var tokens = [];
      var lastIndex = defaultTagRE.lastIndex = 0; //全局的正则需要每次设置 前置为0

      var match, index; //每次匹配到的结果

      while (match = defaultTagRE.exec(text)) {
        //match     0: "{{a.b}}"   1: "a.b"   groups: undefined   index: 5   input: "hello{{a.b}} world {{c.d}}"
        index = match.index; // 如果 index > lastindex 说明前面有文本

        if (index > lastIndex) {
          //放进去
          tokens.push(JSON.stringify(text.slice(lastIndex, index)).trim());
        }

        tokens.push("_s(".concat(match[1].trim(), ")")); // 索引换成 文本的索引加上 当前的长度

        lastIndex = index + match[0].length;
      } // 如果 lastindex 小于文本总长度，说明最后还有文本


      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)).trim());
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunctions(template) {
    var ast = htmlParser(template); //生成AST语法树

    var code = generate(ast); //生成render函数备用code字符串

    console.log(code);
    var render = new Function("with(this){ return (".concat(code, ") }"));
    return render;
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, updateComponent, callback, isRender) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.updateComponent = updateComponent;
      this.callback = callback;
      this.isRender = isRender;
      this.deps = []; // 记录watcher对应的依赖数据

      this.depsId = new Set(); // 利用set去重的特性, 记录

      this.id = id++;

      if (typeof updateComponent === 'function') {
        this.getter = updateComponent;
      }

      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // 每次渲染页面前标记下当前组件被哪个watcher管理
        pushTarget(this);
        this.getter(); // 渲染页面后取消标记

        popTarget();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        // 双项添加, 组件wather记录收集依赖, 每个依赖记录自己的爹
        // 如果不重复, 便添加该dep 为了避免 watcher.deps[name,name] 出现多个同名依赖的情况, 一个属性只对应一个依赖
        if (!this.depsId.has(dep.id)) {
          this.deps.push(dep);
          dep.addSub(this);
          this.depsId.add(dep.id);
        }
      }
    }, {
      key: "update",
      value: function update() {
        this.getter();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, newVnode) {
    var el = createElm(newVnode);
    var parentEle = oldVnode.parentNode;
    parentEle.insertBefore(el, oldVnode.nextSibling);
    parentEle.removeChild(oldVnode);
    return el;
  }

  function createElm(vnode) {
    var tag = vnode.tag;
        vnode.data;
        vnode.key;
        var children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      children && children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      this.$el = patch(this.$el, vnode); // patch将虚拟DOM生成, 并替换原DOM
    };
  }
  function mountComponent(vm, el) {
    // 更新虚拟节点
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // 每一个组件有一个唯一的观察者


    new Watcher(vm, updateComponent, function () {
      callHooks(vm, 'berforeMount');
    }, true);
    callHooks(vm, 'Mounted');
  }
  function callHooks(vm, hook) {
    // 取出声明周期数组
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0, handler; handler = handlers[i++];) {
        handler.call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 将Vue上的options合并到this.$options上

      this.$options = mergeOptions(this.constructor.options, options); // 对做响应式!\

      callHooks(vm, 'beforeCreate');
      initState(vm);
      callHooks(vm, 'created'); // 模板渲染

      if (this.$options.el) {
        this.$mount(this.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var options = this.$options;
      this.$el = el = document.querySelector(el);
      var template = options.template; //假设有template

      if (!options.render) {
        if (el && !options.template) {
          template = el.outerHTML;
        }
      }

      var render = compileToFunctions(template);
      options.render = render; //挂载组件

      var vm = this;
      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments);
    };

    Vue.prototype._v = function (text) {
      return createTextVnode(text);
    };

    Vue.prototype._s = function (value) {
      return value === null ? '' : _typeof(value) === 'object' ? JSON.stringify(value) : value;
    };

    Vue.prototype._render = function () {
      var render = this.$options.render; // 将this传进去

      var vnode = render.call(this);
      return vnode;
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data.key, data, children, undefined);
  }

  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, key, data, children, text) {
    // 虚拟dom节点
    return {
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    this.$options = options;

    this._init(options);
  } // 扩展原型 公共方法挂载原型上


  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue); // 扩展静态方法

  globalMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
