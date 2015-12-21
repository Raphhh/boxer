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