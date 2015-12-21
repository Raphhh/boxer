var Boxer = Boxer || {};
Boxer.Source = Boxer.Source || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {{GeoJSONSource: function}} mapboxgl
     * @constructor
     */
    Boxer.Source.SourceFactory = function(mapboxgl){
        this.mapboxgl = mapboxgl;
    };

    /**
     *
     * @param {object} geoJson
     * @returns {this.mapboxgl.GeoJSONSource}
     */
    Boxer.Source.SourceFactory.prototype.createFromGeoJson = function(geoJson){
        return new this.mapboxgl.GeoJSONSource({
            data: geoJson
        });
    };

})(Boxer);