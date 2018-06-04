"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var BreaktimeServer = /** @class */ (function () {
    function BreaktimeServer() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    BreaktimeServer.prototype.createApp = function () {
        this.app = express();
    };
    BreaktimeServer.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    BreaktimeServer.prototype.config = function () {
        this.port = process.env.PORT || BreaktimeServer.PORT;
    };
    BreaktimeServer.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    BreaktimeServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            console.log('Connected client on port %s.', _this.port);
            socket.on('vote', function (v) {
                console.log('[server](vote): %s', JSON.stringify(v));
                _this.io.emit('vote', v);
            });
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });
    };
    BreaktimeServer.prototype.getApp = function () {
        return this.app;
    };
    BreaktimeServer.PORT = 8080;
    return BreaktimeServer;
}());
exports.BreaktimeServer = BreaktimeServer;
