var Boxer = Boxer || {};
Boxer.GeoLocation = Boxer.GeoLocation || {};

(function(Boxer){
    'use strict';

    var cloneGeoPosition = function(geoPosition){
        return {
            timestamp: geoPosition.timestamp,
            coords:{
                accuracy:  geoPosition.coords.accuracy,
                altitude: geoPosition.altitude,
                altitudeAccuracy: geoPosition.altitudeAccuracy,
                heading: geoPosition.heading,
                latitude: geoPosition.coords.latitude,
                longitude: geoPosition.coords.longitude,
                speed: geoPosition.coords.speed
            }
        };
    };

    /**
     *
     * @param navigator navigator
     * @param {object} [options]
     * @param {{log:Function}} [logger]
     * @constructor
     */
    Boxer.GeoLocation.WatcherProvider = function(navigator, options, logger){
        this.navigator = navigator;
        this.options = options;
        this.logger = logger || {log:function(){}};
    };

    /**
     *
     * @param {Boxer.Application} application
     */
    Boxer.GeoLocation.WatcherProvider.prototype.execute = function(application){
        this.logger.log('WatcherProvider.execute()', arguments);

        var that = this;
        var geoPositions = [];
        var firstTime = true;

        application.on('geo.init', function(){
            firstTime = false;
        });

        if(that.navigator.geolocation) {
            that.navigator.geolocation.watchPosition(
                function(geoPosition){
                    that.logger.log('geolocation.watchPosition.success', arguments);

                    geoPosition = cloneGeoPosition(geoPosition);
                    geoPositions.push(geoPosition);
                    if(firstTime){
                        application.emit('geo.init', [geoPosition]);
                    }
                    application.emit('geo.success', [geoPosition, geoPositions]);
                },
                function(positionError){
                    that.logger.log('geolocation.watchPosition.error', arguments);

                    application.emit('geo.error', [positionError]);
                },
                that.options
            );
        }else{
            that.emit('geo.refusal');
        }
    };

})(Boxer);