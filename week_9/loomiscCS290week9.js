var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

var mysql = require('./mysqlpool.js');
/*var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});*/

app.get('/',function(req,res,next){
	var context = {};
//create table if it does not exist
	mysql.pool.query("CREATE TABLE IF NOT EXISTS workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)", function(err, rows, fields){
    	if(err){
			next(err);
			return;
		}});
	
	function validateDate() {
    	if(document.forms["addExercise"]["month"].value != null || document.forms["addExercise"]["month"].value != ""){
			if(document.forms["addExercise"]["day"].value != null || document.forms["addExercise"]["day"].value != ""){
				if(document.forms["addExercise"]["year"].value != null || document.forms["addExercise"]["year"].value != ""){
					if(!(document.forms["addExercise"]["year"].value.length > 5)){
						return true;
					}
				}
			}
		}
		else if(document.forms["addExercise"]["month"].value == null || document.forms["addExercise"]["month"].value == ""){
			if(document.forms["addExercise"]["day"].value == null || document.forms["addExercise"]["day"].value == ""){
				if(document.forms["addExercise"]["year"].value == null || document.forms["addExercise"]["year"].value == ""){
					return true;
				}
			}
		}
		else{
			return false;
		}
	}
	
//post listener for adding row
	document.getElementById("newExerciseSubmit").addEventListener("click", function(event){
		var req = new XMLHttpRequest();
		var payload = {exerciseName: null,
					  reps: null,
					  weight: null,
					  date: null,
					  lbs: null};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
		payload.name = document.getElementById("exerciseName").value;
		
		if(document.forms["addExercise"]["reps"].value != null || document.forms["addExercise"]["reps"].value != ""){
			payload.reps = document.getElementById("reps").value; 
		}
		
		if(document.forms["addExercise"]["weight"].value != null || document.forms["addExercise"]["weight"].value != ""){
			payload.weight = document.getElementById("weight").value; 
		}
		
		if(document.forms["addExercise"]["month"].value != null || document.forms["addExercise"]["month"].value != ""){
			if(document.forms["addExercise"]["day"].value != null || document.forms["addExercise"]["day"].value != ""){
				if(document.forms["addExercise"]["year"].value != null || document.forms["addExercise"]["year"].value != ""){
					if(!(document.forms["addExercise"]["year"].value.length > 5)){
						payload.date = document.getElementById("year").value+"-"+document.getElementById("month").value+"-"+document.getElementById("day").value;
					}
				}
			}
		}
		else{
			payload.date = null;
		}
		
		if(document.forms["addExercise"]["month"].value == "lbs"){
			payload.lbs = 1;
		}
		
		if(document.forms["addExercise"]["month"].value == "kg"){
			payload.lbs = 0;
		}
																					/////////////////UPDATE
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////			
		req.open("POST", "/insert", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener("load",function(){
			if(req.status >= 200 && req.status < 400){//no error so utilize data returned
				//var response = JSON.parse(req.responseText);
				//we need to parse the JSON inside the JSON returned
				//response = JSON.parse(response.data);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////					
				//document.getElementById("response").textContent = response.input; 				/////////////////UPDATE
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////					
			}
			else{//error
				console.log("Error in network request: " + request.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();
	});
	
//get table	
	mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home',context);
  });
});

app.get('/safe-update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM todo WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE todo SET name=?, done=?, due=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.done || curVals.done, req.query.due || curVals.due, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
    }
  });
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