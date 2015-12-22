var Boxer = Boxer || {};
Boxer.GeoJson = Boxer.GeoJson || {};

(function(Boxer){
    'use strict';

    /**
     * 
     * @constructor
     */
    Boxer.GeoJson.GeoCollection = function(){
        this.type = 'FeatureCollection';
        this.features = [];
    };

    /**
     * 
     * @param {Position} geoJson
     */
    Boxer.GeoJson.GeoCollection.prototype.add = function(geoJson){
        this.features.push(geoJson);
    };

})(Boxer);