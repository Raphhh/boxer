var Boxer = Boxer || {};
Boxer.Map = Boxer.Map || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {{Map: Object}} mapboxgl
     * @constructor
     */
    Boxer.Map.MapFactory = function(mapboxgl){
        this.mapboxgl = mapboxgl;
    };

    /**
     *
     * @param {Object} options
     * @returns Object
     */
    Boxer.Map.MapFactory.prototype.create = function(options){
        return new this.mapboxgl.Map(options);
    };

})(Boxer);