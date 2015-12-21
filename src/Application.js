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
