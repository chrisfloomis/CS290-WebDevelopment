var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(express.static('public'));

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
//get table	
	mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
	//context.results = JSON.stringify(rows);
    context.workoutDB = rows;
    res.render('home', context);
  });
});

app.get('/update',function(req,res,next){
	var context = {};
//get table	
	mysql.pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id], function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		
	var month = 99;//rows.date[5]+rows.date[6];
	var day = 99;//rows.date[8]+rows.date[9];
	var year = 99;//rows.date[0]+rows.date[1]+rows.date[2]+rows.date[3];
		
		/*var updateForm = {"prefilledForm" : '<div id="tmpform">'+
		'<form name="updateExercise">'+
			'<fieldset>'+
				'<legend>Update Exercise</legend>'+
				'<p>Exercise Name: <input id="exerciseName" type="text" name="exerciseName" value='+rows.name+'></p>'+
				'<p>Repetitions: <input id="reps" type="number" name="reps" min="1" value='+rows.reps+'></p>'+
				'<p>Weight: <input id="weight" type="number" name="weight" min="1" value='+rows.weight+'>'}
		
		if(rows.lbs == 1)
			updateForm.prefilledForm += '<input type="radio" id="lbs" name="lbskg" value=1 checked>lbs. <input type="radio" id="kg" name="lbskg" value=0 >kg.</p>';
		if(rows.lbs == 0)
			updateForm.prefilledForm += '<input type="radio" id="lbs" name="lbskg" value=1>lbs. <input type="radio" id="kg" name="lbskg" value=0 checked>kg.</p>';
		
		updateForm.prefilledForm += '<p>Date Performed (month/day/year):'+
			'<input id="month" type="number" name="month" min="1" max="12" value='+month+'>/'+
			'<input id="day" type="number" name="day" min="1" max="31" value='+day+'>/'+
			'<input id="year" type="number" name="year" size="4"value='+year+'></p>'+
			'</fieldset>'+
			'<input type="submit" id="updateExerciseSubmit" value="Add Exercise">'+
		'</form>'+
	'</div>';
	*/
	res.send(rows);	
	
    /*context.name = rows.name;
	context.reps = rows.reps;
	context.weight = rows.weight;
	if(rows.lbs == 1)
		context.lbs = 1;
	if(rows.lbs == 0)
		context.kg = 1;
	context.month = rows.date[5]+rows.date[6];
	context.day = rows.date[8]+rows.date[9];
	context.year = rows.date[0]+rows.date[1]+rows.date[2]+rows.date[3];
    res.render('update', context);*/
  });
});

app.get('/insert',function(req,res,next){
	var context = {};
	mysql.pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)", [req.query.exerciseName, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
	var retobject = {"results" : "Inserted id " + result.insertId,
					"newID" : result.insertId}
	res.send(retobject);
    //context.results = "Inserted id " + result.insertId;
    //res.render('home',context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
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

app.get('/safe-update',function(req,res,next){console.log("safe update");
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, done=?, due=? WHERE id=? ",
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

app.get('/delete',function(req,res,next){
	var context = {};
	mysql.pool.query("DELETE FROM workouts WHERE id=?",[req.query.id], function(err,result){
		if(err){
			next(err);
			return;
		}
	context.results = "Deleted " + result.changedRows + " rows.";
    res.render('home',context);
	})
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