function EventHandler() {    
}

EventHandler.prototype = {
    
    addEventListener: function (event, callback) {
        this[event] = callback;
    },
    
    _raiseEvent: function (event, args) {
        if (this[event]) {
            this[event].call(this, args);
        }
    }    
    
}