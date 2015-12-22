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