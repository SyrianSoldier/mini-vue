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

    observer(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 对做响应式!

      initState(vm);
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
