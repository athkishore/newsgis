#from __future__ import print_function
from flask import Flask, render_template, request, redirect, session, url_for
import urllib2
from flask.ext.wtf import Form
from wtforms import StringField, SubmitField, FloatField
from wtforms.validators import Required, NumberRange
from flask.ext.bootstrap import Bootstrap

app = Flask(__name__)
app.config['SECRET_KEY'] = 'hard to guess string'
bootstrap = Bootstrap(app)

@app.route('/')
def index():
  return render_template('gis.html')

@app.route('/proxy')
def proxy():  
  allowedHosts = ['localhost:8080', '188.166.179.117:8080', 'www.openlayers.org']
  url = request.args.get('url')
  if url == "" or url is None:
    url = "http://www.openlayers.org"
      
  host = url.split("/")[2]
  if host in allowedHosts:
    response = urllib2.urlopen(url)
    feature_info = response.read()
    response.close()
    return feature_info
  else:
    print host
    return "Host not allowed"

@app.route('/add', methods=['GET', 'POST'])
def add():
  return render_template('gis_input.html')

if __name__ == '__main__':
  app.run(host='0.0.0.0')

    