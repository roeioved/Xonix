$.Controller('GameController', {
    init:function () {
        if (!this._root) {
            this._root = $($.View('./views/game.ejs'));
            this._root.hide();
            this._root.appendTo($('#container'));
        }
    },

    show:function () {
        this._root.show();
    },

    hide:function () {
        if (this._root) {
            this._root.hide();
        }
    },
    
    get_canvas: function() {
        return document.getElementById("canvas");
    },
    
    get_context2d: function() {
        var canvas = document.getElementById("canvas");
        return canvas.getContext("2d");
    }
    
});


GameController.prototype = $.extend(
    {},
    EventHandler.prototype,
    GameController.prototype
);