var Boxer = Boxer || {};
Boxer.GeoJson = Boxer.GeoJson || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {Position} geoPosition
     * @returns {{type: string, properties: {}, geometry: {type: string, coordinates: Array}}}
     * @constructor
     */
    Boxer.GeoJson.GeoLine = function(geoPosition){

        var mappedCoordinates = [];
        for(var i = 0, length = geoPosition.length; i < length; ++i){
            mappedCoordinates.push([geoPosition[i].coords.longitude, geoPosition[i].coords.latitude])
        }

        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: mappedCoordinates
            }
        };
    };

})(Boxer);