#from __future__ import print_function
from flask import Flask, render_template, request, redirect, session, url_for, flash
import urllib2
from flask.ext.wtf import Form
from wtforms import StringField, SubmitField, FloatField
from wtforms.validators import Required, NumberRange
from flask.ext.bootstrap import Bootstrap
from flask import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'hard to guess string'
bootstrap = Bootstrap(app)

if not app.debug:
  import logging
  from logging.handlers import RotatingFileHandler
  file_handler = RotatingFileHandler('errors.log','a',1*1024*1024,10)
  file_handler.setLevel(logging.INFO)
  app.logger.addHandler(file_handler)

@app.route('/')
def index():
  f = open('data.csv','r')
  data = []
  s = f.readline()
  while s!='':
    data.append(s.split('|'))
    s = f.readline()
  return render_template('gis.html', data=data, len=len)

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


class AddPointForm(Form):
  lon = FloatField('Longitude: ', validators=[Required()])
  lat = FloatField('Latitude: ', validators=[Required()])
  date = StringField('Date: ', validators=[Required()])
  details = StringField('Details', validators=[Required()])
  submit = SubmitField('Submit')

@app.route('/add', methods=['GET', 'POST'])
def add():
  form = AddPointForm()
  if form.validate_on_submit():
    lon = form.lon.data
    lat = form.lat.data
    date = form.date.data
    details = form.details.data
    f = open('data.csv', 'a')
    f.write(str(lon)+'|'+str(lat)+'|'+date+'|'+details+'\n')
    f.close()
    flash('Data successfully saved')
    return redirect(url_for('add'))
  return render_template('gis_input.html', form=form)

@app.route('/kannolichira')
def kannolichira():
  return render_template('kannolichira.html')  

if __name__ == '__main__':
  app.run(host='0.0.0.0')

      