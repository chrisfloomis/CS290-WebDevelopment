var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

//need to try to use post first, otherwise the get would work everytime and post body would never be checked
app.post('/', function(req,res){
  var qParams = [];
	//said to check for query in the URL first, a bit of a mislabel w/ "GET"
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p],'reqType':"GET"});
  }
  for (var p in req.body){
    qParams.push({'name':p,'value':req.body[p],'reqType':"POST"});
  }
  console.log(qParams);
  console.log(req.body);
  var context = {};
  context.reqType = "POST";
  context.dataList = qParams;
  res.render('table', context);
});
/*so if there is no body and it is not a post
app.get('/',function(req,res){
  var qParams = [];
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p],'reqType':"GET"})
  }
  var context = {};
  context.reqType = "GET";
  context.dataList = qParams;
  res.render('table', context);
});*/

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