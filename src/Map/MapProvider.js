var Boxer = Boxer || {};
Boxer.Map = Boxer.Map || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {object} mapboxgl
     * @param {object} options
     * @param {object} [layers]
     * @param {{log:function}} [logger]
     * @constructor
     */
    Boxer.Map.MapProvider = function(mapboxgl, options, layers, logger){
        this.mapboxgl = mapboxgl;
        this.options = options;
        this.layers = layers;
        this.logger = logger || {log:function(){}};
    };

    /**
     *
     * @param {Boxer.Application} application
     */
    Boxer.Map.MapProvider.prototype.execute = function(application){
        console.log('MapProvider.execute()', arguments);

        var that = this;
        var mapManager = new Boxer.Map.MapManager(
            new Boxer.Map.MapFactory(this.mapboxgl),
            this.logger
        );

        mapManager.onMapReady(function(map){
            application.services.map = map;
            application.services.geoManager = new Boxer.GeoJson.GeoManager(
                new Boxer.Source.SourceManager(map, that.logger, that.layers),
                new Boxer.Source.SourceFactory(that.mapboxgl)
            );
            application.services.mapManager = mapManager;
            application.emit('map.ready', [map]);
        });

        mapManager.init(this.options);
    };

})(Boxer);