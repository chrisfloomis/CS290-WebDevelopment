var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/',function(req,res){
  res.render('home');
});

app.get('/other-page',function(req,res){
  res.render('other-page');
});

function randNum(){
	var display = {};
	display.rando = Math.random();
	return display;
}

app.get('/math-random',function(req,res){
  res.render('random',randNum());
});

app.post('/request', function(req,res){
  var qGetParams = [];
  for (var p in req.query){
    qGetParamsParams.push({'name':p,'value':req.query[p]})
  }
  var qPostParams = [];
  for (var p in req.body){
    qPostParams.push({'name':p,'value':req.body[p]})
  }
  console.log(qPostParams);
  console.log(req.body);
  var context = {};
  context.reqType = "POST";
  context.dataList = qPostParams+qGetParams;
  res.render('list', context);
});

app.get('/request',function(req,res){
  var qParams = [];
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p]})
  }
  var context = {};
  context.reqType = "GET";
  context.dataList = qParams;
  res.render('list', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});