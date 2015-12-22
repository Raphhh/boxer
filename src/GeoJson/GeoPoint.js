var Boxer = Boxer || {};
Boxer.GeoJson = Boxer.GeoJson || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {Position} geoPosition
     * @returns {{type: string, properties: {}, geometry: {type: string, coordinates: *[]}}}
     * @constructor
     */
    Boxer.GeoJson.GeoPoint = function(geoPosition){
        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [geoPosition.coords.longitude, geoPosition.coords.latitude]
            }
        };
    };

})(Boxer);