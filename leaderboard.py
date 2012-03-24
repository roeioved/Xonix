import cgi
import uuid
import simplejson as json

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class Leaderboard(db.Model):
    id = db.StringProperty()
    player = db.StringProperty()
    score = db.IntegerProperty()
    date = db.DateTimeProperty(auto_now_add=True)

class GetLeaderboardPage(webapp.RequestHandler):
    def get(self):
        count = int(cgi.escape(self.request.get('count')))

        self.response.headers['Content-Type'] = 'application/json'

        top = []
        scores = db.GqlQuery("SELECT * FROM Leaderboard ORDER BY score DESC LIMIT " + str(count))
        for score in scores:
            top.append({ 'player': score.player, 'score': score.score })

        self.response.out.write(json.dumps(top))

class SetLeaderboardPage(webapp.RequestHandler):
    def post(self):
        playerName = cgi.escape(self.request.get('name'))
        playerScore = long(cgi.escape(self.request.get('score')))
        count = int(cgi.escape(self.request.get('count')))

        self.response.headers['Content-Type'] = 'application/json'

        place = Leaderboard.all().filter('score >=', playerScore).count()

        row = Leaderboard()
        row.id = str(uuid.uuid1())
        row.player = playerName
        row.score = playerScore
        row.put()

        top = []
        scores = db.GqlQuery("SELECT * FROM Leaderboard ORDER BY score DESC LIMIT " + str(count))
        for score in scores:
            top.append({ 'player': score.player, 'score': score.score })

        data = { 'place': place, 'leaderboard': top }
        self.response.out.write(json.dumps(data))

class DeleteLeaderboardPage(webapp.RequestHandler):
    def get(self):
        playerName = cgi.escape(self.request.get('name'))

        results = db.GqlQuery("SELECT * FROM Leaderboard WHERE player = " + str(playerName))
        db.delete(results)

application = webapp.WSGIApplication(
                                     [('/leaderboard/get', GetLeaderboardPage), ('/leaderboard/set', SetLeaderboardPage), ('/leaderboard/del', SetLeaderboardPage)],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()