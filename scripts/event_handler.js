function EventHandler() {    
}

EventHandler.prototype = {
    
    addEventListener: function (event, callback, context) {
        var name = '__' + event;
        this[name] = { callback:callback, context:context };
    },
    
    _raiseEvent: function (event, args) {
        var arr = [];
        for(var i=1; i<this._raiseEvent.arguments.length; i++) {
            arr.push(this._raiseEvent.arguments[i]);
        }
        var name = '__' + event;
        if (this[name]) {
            this[name].callback.apply(this[name].context, arr);
        }
    }    
    
}