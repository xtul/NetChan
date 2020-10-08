"use strict";
exports.__esModule = true;
require("core-js/stable");
require("regenerator-runtime/runtime");
var vue_1 = require("vue");
require("./plugins/axios");
var vuetify_1 = require("./plugins/vuetify");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
var index_1 = require("@/store/index");
require("./registerServiceWorker");
var date_filter_1 = require("@/filters/date.filter");
var boilerplate_1 = require("@/mixins/boilerplate");
vue_1["default"].config.productionTip = true;
vue_1["default"].filter('date', date_filter_1["default"]);
vue_1["default"].mixin(boilerplate_1.boilerplate);
vue_1["default"].component('Logo', function () { return Promise.resolve().then(function () { return require('./components/Details/Logo.vue'); }); });
vue_1["default"].component('BoardHeader', function () { return Promise.resolve().then(function () { return require('./components/Details/BoardHeader.vue'); }); });
vue_1["default"].component('Loading', function () { return Promise.resolve().then(function () { return require('./components/Details/Loading.vue'); }); });
new vue_1["default"]({
    vuetify: vuetify_1["default"],
    router: router_1["default"],
    store: index_1["default"],
    render: function (h) { return h(App_vue_1["default"]); }
}).$mount('#app');
