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
            self._raiseEvent('keydown');
        });

        this._root.bind('click.sb', function (e) {
            self._raiseEvent('click');
        });
    },

    hide:function () {
        if (this._root) {
            this._root.hide();
        }
        $(document).unbind('keydown.sb');
        this._root.unbind('click.sb');
    }


});

ScoreBoard.prototype = $.extend(
    {},
    EventHandler.prototype,
    ScoreBoard.prototype
);