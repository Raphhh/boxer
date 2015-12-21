var Boxer = Boxer || {};
Boxer.Map = Boxer.Map || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {Boxer.Map.MapFactory} mapFactory
     * @param {{log: function}} [logger]
     * @constructor
     */
    Boxer.Map.MapManager = function(mapFactory, logger){
        this.mapFactory = mapFactory;
        this.logger = logger || {log:function(){}};
        this.map = null;
        this.callbacks = [];
    };

    /**
     *
     * @param {Object} options
     */
    Boxer.Map.MapManager.prototype.init = function(options){
        this.logger.log('MapManager.init()', arguments);

        this.map = this.mapFactory.create(options);

        var that = this;
        this.map.on('load', function () {
            that.logger.log('MapManager: map is loaded');
            for(var i = 0, length = that.callbacks.length; i < length; ++i){
                that.callbacks[i](that.map);
            }
        });
    };

    /**
     *
     * @param {function} callback
     */
    Boxer.Map.MapManager.prototype.onMapReady = function(callback){
        this.callbacks.push(callback);
    };

})(Boxer);