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