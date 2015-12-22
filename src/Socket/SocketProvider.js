var Boxer = Boxer || {};
Boxer.Socket = Boxer.Socket || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {{connect:Function}} io
     * @param {string} url
     * @param {Object} [options]
     * @param {Array} [events]
     * @constructor
     */
    Boxer.Socket.SocketProvider = function(io, url, options, events){
        this.io = io;
        this.url = url;
        this.options = options || {};
        this.events = events || [];
    };

    /**
     *
     * @param {Boxer.Application} application
     */
    Boxer.Socket.SocketProvider.prototype.execute = function(application){
        if(!application.services.socket){
            application.services.socket = this.io.connect(this.url, this.options);
            for(var i = 0, length = this.events.length; i < length; ++i){
                var eventName = this.events[i];
                application.services.socket.on(eventName, function(userData) {
                    application.emit('socket.' + eventName, [userData]);
                });
            }
            application.emit('socket.init', [application.services.socket]);
        }
    };

})(Boxer);