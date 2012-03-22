$.Controller('GameController', {
    init:function () {
        if (!this._root) {
            this._root = $($.View('./views/game.ejs'));
            this._root.hide();
            this._root.appendTo($('#container'));
            
            $('#mute', this._root).click(function (e) {
                this._raiseEvent('mute');
            });
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
    
    get_context2d: function() {
        var canvas = document.getElementById("canvas");
        return canvas.getContext("2d");
    },
    
    set_mute: function(val) {
        $('#mute').removeClass("on").removeClass("off");
        $('#mute').addClass(val);
    }
});


GameController.prototype = $.extend(
    {},
    EventHandler.prototype,
    GameController.prototype
);