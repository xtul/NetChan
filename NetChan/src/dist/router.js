"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var Home_vue_1 = require("./views/Home.vue");
var Board_vue_1 = require("./views/Board.vue");
var Thread_vue_1 = require("./views/Thread.vue");
var ReportForm_vue_1 = require("./components/Forms/ReportForm.vue");
vue_1["default"].use(vue_router_1["default"]);
exports["default"] = new vue_router_1["default"]({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: function (to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            };
        }
        return { x: 0, y: 0 };
    },
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home_vue_1["default"],
            meta: {
                title: 'Home'
            }
        },
        {
            path: '/:board/report',
            name: 'report',
            component: ReportForm_vue_1["default"],
            meta: {
                title: 'Report post'
            }
        },
        {
            path: '/:board/list',
            name: 'board-list',
            component: Board_vue_1["default"],
            props: { list: true }
        },
        {
            path: '/:board',
            name: 'board',
            component: Board_vue_1["default"],
            children: [
                {
                    path: ':page',
                    name: 'board-page',
                    component: Board_vue_1["default"]
                },
                {
                    path: '/archive',
                    name: 'board-archive',
                    component: Board_vue_1["default"],
                    props: { archive: true }
                }
            ]
        },
        {
            path: '/:board/thread/:threadId',
            name: 'thread',
            component: Thread_vue_1["default"]
        },
        {
            path: '/*',
            name: 'notfound',
            component: Board_vue_1["default"],
            meta: {
                title: 'Not found'
            }
        },
    ]
});
