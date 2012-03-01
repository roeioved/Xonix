function EventHandler() {    
}

EventHandler.prototype = {
    
    addEventListener: function (event, callback, context) {
        var name = '__' + event;
        this[name] = { callback:callback, context:context };
    },
    
    _raiseEvent: function (event, args) {
        var name = '__' + event;
        if (this[name]) {
            this[name].callback.call(this[name].context, args);
        }
    }    
    
}