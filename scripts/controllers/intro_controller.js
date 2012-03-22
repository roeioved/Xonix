$.Controller('Intro', {
    init:function () {
        if (!this._root) {
            this._root = $($.View('./views/intro.ejs'));
            this._root.hide();
            this._root.appendTo($('#container'));

            var self = this;
            this._root.click(function() {
                self._raiseEvent('start');
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
    }
});

Intro.prototype = $.extend(
    {},
    EventHandler.prototype,
    Intro.prototype
);