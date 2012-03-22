$.Controller('Score', {
    init:function () {
    },
    
    show:function (score, leaderboard) {
        if (!this._root) {
            this._root = $($.View('./views/score.ejs', { 'score':score, 'leaderboard':leaderboard }));
            this._root.appendTo($('#container'));
        } else {
            $('#score_val', this._root).text(score);
            $('#leaderboard_val', this._root).text(leaderboard);
        }
        
        this._root.show();
        this._bindEvents();
    },
    
    hide:function () {
        if (this._root) {
            this._root.hide();
        }
        $(document).unbind('keydown.sc');
        $(document).unbind('keypress.sc');
        
        clearInterval(this._cursorInterval);
    },
    
    _bindEvents:function () {
        var self = this;
        
        this._cursorInterval = setInterval(function () {
            var text = $('#cursor').text();
            text == "_" ? $('#cursor').text("") : $('#cursor').text("_");
        }, 300);
        
        $(document).bind('keypress.sc', function(e) { self._onKeyPress.call(self, e); });
        $(document).bind('keydown.sc', function(e) { self._onKeyDown.call(self, e); } );
    },
    
    _onKeyDown:function (e) {
        if (e.which == 8) {
            $('#user_name').text($('#user_name').text().substr(0, $('#user_name').text().length - 1))
            e.preventDefault();
        }
        else if (e.which == 13) {
            this._raiseEvent('enter', $('#user_name').text());
        }
    },
    
    _onKeyPress:function (e) {
        if ($('#user_name').text().length < 20) {
            $('#user_name').text($('#user_name').text() + String.fromCharCode(e.which));
        }
    }
});

Score.prototype = $.extend(
    {},
    EventHandler.prototype,
    Score.prototype
);