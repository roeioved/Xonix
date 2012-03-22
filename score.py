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

class MainPage(webapp.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        playerName = cgi.escape(self.request.get('name'))
        playerScore = long(cgi.escape(self.request.get('score')))
        #self.response.out.write('Hello ' + playerName + ', you scored ' + str(playerScore) + '!' + '<br/>')

        place = Leaderboard.all().filter('score >=', playerScore).count()
        #self.response.out.write('You are in place ' + str(place + 1) + '<br/>')

        row = Leaderboard()
        row.id = str(uuid.uuid1())
        row.player = playerName
        row.score = playerScore
        row.put()

        top = []
        scores = db.GqlQuery("SELECT * FROM Leaderboard ORDER BY score DESC LIMIT 15")
        for score in scores:
            #self.response.out.write(score.player + ' ' + str(score.score) + '<br>')
            top.append({ 'player': score.player, 'score': score.score })

        data = { 'place': place, 'leaderboard': top }
        self.response.out.write(json.dumps(data))

application = webapp.WSGIApplication(
                                     [('/score', MainPage)],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()