LeaderBoard = {

    _baseUrl: "http://html5xonix.appspot.com/leaderboard",

    get: function(count, callback) {
        $.get(this._baseUrl + "/get", {count: count}, function(data) {
            if (callback)
            {
                callback.call(this, data);
            }
        }, 'json');
    },

    set: function(name, score, count, callback) {
        $.post(this._baseUrl + "/set", {name: name, score: score, count: count}, function(data) {
            if (callback)
            {
                callback.call(this, data);
            }
        }, 'json');
    }
}