var Boxer = Boxer || {};
Boxer.GeoJson = Boxer.GeoJson || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {Boxer.Source.SourceManager} sourceManager
     * @param {Boxer.Source.SourceFactory} sourceFactory
     * @constructor
     */
    Boxer.GeoJson.GeoManager = function(sourceManager, sourceFactory){
        this.sourceManager = sourceManager;
        this.sourceFactory = sourceFactory;
    };

    /**
     *
     * @param {string} id
     * @param {Object} geoJson
     */
    Boxer.GeoJson.GeoManager.prototype.init = function(id, geoJson) {
        this.sourceManager.init(id, this.sourceFactory.createFromGeoJson(geoJson));
    };

    /**
     *
     * @param {string} id
     * @param {Object} geoJson
     */
    Boxer.GeoJson.GeoManager.prototype.refresh = function(id, geoJson) {
        this.sourceManager.refresh(id, this.sourceFactory.createFromGeoJson(geoJson));
    };

    /**
     *
     * @param {string} id
     * @param {Object} geoJson
     */
    Boxer.GeoJson.GeoManager.prototype.put = function(id, geoJson){
        this.sourceManager.put(id, this.sourceFactory.createFromGeoJson(geoJson));
    };

})(Boxer);