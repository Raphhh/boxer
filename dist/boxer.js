var Boxer = Boxer || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {Object} [services]
     * @param {Array} [bundles]
     * @constructor
     */
    Boxer.Application = function(services, bundles){
        this.services = services || {};
        this.bundles = bundles || [];
        this.providerList = {};
        this.callbackList = {};

        if(bundles){
            for(var i = 0, length = bundles.length; i < length; ++i) {
                this.addBundle(bundles);
            }
        }

        this.services.logger = this.services.logger || {log:function(){}};
    };

    /**
     *
     * @param {{initProviders: function, initEventListeners:function}} bundle
     */
    Boxer.Application.prototype.addBundle = function(bundle){
        bundle.initProviders(this);
        bundle.initEventListeners(this);
        this.bundles.push(bundle);
    };

    /**
     *
     * @param {string} eventName
     * @param {function} callback
     */
    Boxer.Application.prototype.on = function(eventName, callback){
        if(!this.callbackList[eventName]){
            this.callbackList[eventName] = [];
        }
        this.callbackList[eventName].push(callback);
    };

    /**
     *
     * @param {string} eventName
     * @param {Array} args
     */
    Boxer.Application.prototype.emit = function(eventName, args){
        this.services.logger.log('Application.emit()', arguments);

        args = args || [];
        if(this.callbackList[eventName]){
            for(var i = 0, length = this.callbackList[eventName].length; i < length; ++i){
                this.callbackList[eventName][i].apply(this, args);
            }
        }
    };

    /**
     *
     * @param {string} name
     * @param {{execute: function}} provider
     * @returns {function} execute only the registered provider
     */
    Boxer.Application.prototype.register = function(name, provider){
        if(!this.providerList[name]){
            this.providerList[name] = [];
        }
        this.providerList[name].push(provider);

        var that = this;
        return function(args){
            provider.execute(that, args);
        }
    };

    /**
     * execute all the providers register under the given name.
     *
     * @param {string} name
     * @param {Object} [args]
     */
    Boxer.Application.prototype.execute = function(name, args){
        this.services.logger.log('Application.execute()', arguments);

        if(!this.providerList[name]) {
            throw new Error('No provider register for "' + name + '"');
        }

        for(var i = 0, length = this.providerList[name].length; i < length; ++i){
            this.providerList[name][i].execute(this, args);
        }
    };

})(Boxer);


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
        this.logger = logger || {log:function(){}}
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

var Boxer = Boxer || {};
Boxer.Helper = Boxer.Helper || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {Storage} storage
     * @param {{log:Function}} [logger]
     * @constructor
     */
    Boxer.Helper.ObjectStorage = function(storage, logger){
        this.storage = storage;
        this.logger = logger || {log:function(){}};
    };

    /**
     *
     * @param key
     * @returns {*}
     */
    Boxer.Helper.ObjectStorage.prototype.getItem = function(key){
        this.logger.log('ObjectStorage.getItem()', arguments);
        return JSON.parse(this.storage.getItem(key));
    };

    /**
     *
     * @param key
     * @param object
     */
    Boxer.Helper.ObjectStorage.prototype.setItem = function(key, object){
        this.logger.log('ObjectStorage.setItem()', arguments);
        this.storage.setItem(key, JSON.stringify(object));
    };

    /**
     *
     * @param key
     */
    Boxer.Helper.ObjectStorage.prototype.removeItem = function(key){
        this.logger.log('ObjectStorage.removeItem()', arguments);
        this.storage.removeItem(key);
    };

    /**
     *
     * @param key
     */
    Boxer.Helper.ObjectStorage.prototype.key = function(key){
        this.logger.log('ObjectStorage.key()', arguments);
        this.storage.key(key);
    };

    /**
     *
     */
    Boxer.Helper.ObjectStorage.prototype.clear = function(){
        this.logger.log('ObjectStorage.clear()', arguments);
        this.storage.clear();
    };

})(Boxer);

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

var Boxer = Boxer || {};
Boxer.Source = Boxer.Source || {};

(function(Boxer){
    'use strict';

    /**
     *
     * @param {{getSource: function, addSource: function, removeSource:function, getLayer: function, addLayer: function}} map
     * @param {{log: function}} [logger]
     * @param {Object} [layers]
     * @constructor
     */
    Boxer.Source.SourceManager = function(map, logger, layers){
        this.map = map;
        this.logger = logger || {log:function(){}};
        this.layers = layers || {};
    };

    /**
     *
     * @param {string} id
     * @param {Object} source
     */
    Boxer.Source.SourceManager.prototype.init = function(id, source) {
        this.logger.log('SourceManager.initGeo()', arguments);

        this.map.addSource(id, source);

        if(this.layers[id] && !this.map.getLayer(id)){
            this.logger.log('SourceManager.addLayers()', arguments);
            this.map.addLayer(this.layers[id]);
        }
    };

    /**
     *
     * @param {string} id
     * @param {Object} source
     */
    Boxer.Source.SourceManager.prototype.refresh = function(id, source) {
        this.logger.log('SourceManager.resetGeo()', arguments);
        if(this.map.getSource(id).setData){
            this.map.getSource(id).setData(source.data);
        }else{
            this.map.removeSource(id);
            this.map.addSource(id, source);
        }
    };

    /**
     *
     * @param {string} id
     * @param {Object} source
     */
    Boxer.Source.SourceManager.prototype.put = function(id, source){
        if(this.map.getSource(id)){
            this.refresh(id, source);
        }else{
            this.init(id, source);
        }
    };

})(Boxer);