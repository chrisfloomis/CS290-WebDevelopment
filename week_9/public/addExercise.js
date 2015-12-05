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

document.getElementById("newExerciseSubmit").addEventListener("click", function(event){
		var req = new XMLHttpRequest();
		/*var q = "http://52.33.123.28:3000/insert?exerciseName=";
		q += document.getElementById("exerciseName").value;
		q += "&reps="+document.getElementById("reps").value;
		q += "&weight="+document.getElementById("weight").value;
		var date = document.getElementById("year").value+"-"+document.getElementById("month").value+"-"+document.getElementById("day").value;
		q += "&date="+date;
		q += "&lbs="+document.getElementById("lbs").value;*/
		req.open("GET", "http://52.33.123.28:3000/insert?exerciseName="+document.getElementById("exerciseName").value, true);
		req.addEventListener("load",function(){
			if(req.status >= 200 && req.status < 400)
			{//no error so utilize data returned
				var newRow = document.createElement("tr");
				
				var newCell = document.createElement("td");
				var newName = document.getElementById("exerciseName").value;
				newCell.textContent = newName;
				newRow.appendChild(newCell);
				
				newCell = document.createElement("td");
				var newReps = document.getElementById("reps").value;
				newCell.textContent = newReps;
				newRow.appendChild(newCell);
				
				newCell = document.createElement("td");
				var newWeight = document.getElementById("weight").value;
				newCell.textContent = newWeight;
				newRow.appendChild(newCell);
				
				newCell = document.createElement("td");
				var newDate = document.getElementById("year").value+"-"+document.getElementById("month").value+"-"+document.getElementById("day").value;
				newCell.textContent = newDate;
				newRow.appendChild(newCell);
				
				newCell = document.createElement("td");
				var newLbs = document.getElementById("lbs").value;
				newCell.textContent = newLbs;
				newRow.appendChild(newCell);
				
				document.getElementById("wot").appendChild(newRow);
			}
			else
			{//error
				console.log("Error in network request: " + request.statusText);
			}
		});
		req.send(JSON.stringify(req.responseText));
		event.preventDefault();
	});

/*
document.getElementById("newExerciseSubmit").addEventListener("click", function(event){
	var req = new XMLHttpRequest();
	var payload = {exerciseName: null,
				  reps: null,
				  weight: null,
				  date: null,
				  lbs: null};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	payload.exerciseName = document.getElementById("exerciseName").value;

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
	req.open("POST", "http://52.33.123.28:3000/insert", true);
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
});*/