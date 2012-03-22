import cgi

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class MainPage(webapp.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/json'
        user = cgi.escape(self.request.get('user'))
        score = cgi.escape(self.request.get('score'))
        self.response.out.write('Hello ' + user + ', you scored ' + score + '!')

application = webapp.WSGIApplication(
                                     [('/score', MainPage)],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()