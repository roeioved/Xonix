$.Controller('ScoreBoard', {
    init:function () {
    },

    show:function (scoreBoard) {

        if (this._root)
            this._root.remove();

        this._root = $($.View('./views/score_board.ejs', scoreBoard));
        this._root.appendTo($('#container'));


        this._root.show();

        var self = this;
        $(document).bind('keydown.sb', function (e) {
            self._onEnter.call(self, e);
        });
    },

    hide:function () {
        if (this._root) {
            this._root.hide();
        }
        $(document).unbind('keydown.sb');
    },

    _onEnter:function (e) {
        if (e.which == 13) {
            this._raiseEvent('enter');
        }
    }
});

ScoreBoard.prototype = $.extend(
    {},
    EventHandler.prototype,
    ScoreBoard.prototype
);