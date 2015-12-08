//This is the main workhorse of my workouts DB

//function meant to tell me if there is a complete date as I am getting month, day, and year seperately from user
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

//this tells me which radio buttons are checked, should probably use some arguments to make this more useful
function checkRadiolbskg(){
	var lbsRadio = document.getElementsByName("lbskg");
	var weightUnit = null;
	for(var i=0; i<lbsRadio.length; i++){
		if(lbsRadio[i].checked)
			weightUnit = lbsRadio[i].value;
	}
	return weightUnit;
}

//this is to add a new exercise to the DB
document.getElementById("newExerciseSubmit").addEventListener("click", function(event){
		var req = new XMLHttpRequest();
		var addSite = "http://52.33.123.28:3000/insert?exerciseName=";
		var radiolbskg = checkRadiolbskg();
		var date = document.getElementById("year").value+"-"+document.getElementById("month").value+"-"+document.getElementById("day").value;

//big long get query
		req.open("GET", addSite+document.getElementById("exerciseName").value+"&reps="+document.getElementById("reps").value+"&weight="+document.getElementById("weight").value+"&lbs="+radiolbskg+"&date="+date, true);
		req.addEventListener("load",function(){
			if(req.status >= 200 && req.status < 400)
			{//no error so utilize data returned
				//console.log("newExerciseSubmit clicked and successful callback");
				var response = JSON.parse(req.responseText);
//from here to the end of this if statement I am adding the HTML to add the new row to the display				
				var newRow = document.createElement("tr");
				newRow.setAttribute("id", JSON.stringify(response.newID));
				
				var newNameCell = document.createElement("td");
				newNameCell.textContent = document.getElementById("exerciseName").value;
				newRow.appendChild(newNameCell);
				
				var newRepsCell = document.createElement("td");
				newRepsCell.textContent = document.getElementById("reps").value;
				newRow.appendChild(newRepsCell);
				
				var newWeightCell = document.createElement("td");
				newWeightCell.textContent = document.getElementById("weight").value;
				newRow.appendChild(newWeightCell);
				
				//newRow.appendChild(document.createElement("td"));
				//if(document.getElementById("lbs").value != null){
					var newLbsCell = document.createElement("td");
					newLbsCell.textContent = checkRadiolbskg();
					newRow.appendChild(newLbsCell);
				//}
				
				var newDateCell = document.createElement("td");
				var newDate = document.getElementById("year").value+"-"+document.getElementById("month").value+"-"+document.getElementById("day").value;
				newDateCell.textContent = newDate;
				newRow.appendChild(newDateCell);
				
				var newUpdateCell = document.createElement("td");
				var newUpdateButton = document.createElement("button");
				newUpdateButton.textContent = "Update";
				newUpdateButton.setAttribute("name", "updateButton");
				newUpdateButton.setAttribute("onClick", "updateClick(this.value)");
				newUpdateButton.setAttribute("value", JSON.stringify(response.newID));
				newUpdateCell.appendChild(newUpdateButton);
				newRow.appendChild(newUpdateCell);
				
				var newDeleteCell = document.createElement("td");
				var newDeleteButton = document.createElement("button");
				newDeleteButton.textContent = "Delete";
				newDeleteButton.setAttribute("name", "deleteButton");
				newDeleteButton.setAttribute("onClick", "deleteClick(this.value)");
				newDeleteButton.setAttribute("value", JSON.stringify(response.newID));
				newDeleteCell.appendChild(newDeleteButton);
				newRow.appendChild(newDeleteCell);
				
				document.getElementById("wot").appendChild(newRow);
				//document.getElementById("wot").reset();
			}
			else
			{//error
				console.log("Error in network request: " + request.statusText);
			}
		});
		req.send(JSON.stringify(req.responseText));
		event.preventDefault();
	});

//this should update, but I did not get this working in time
function updateClick(clicked_id){console.log(clicked_id);
	var req = new XMLHttpRequest();
	var updateSite = "http://52.33.123.28:3000/update?id="+clicked_id;
	req.open("GET", updateSite, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener("load",function(){
		if(req.status >= 200 && req.status < 400){//console.log(clicked_id);
			var response = JSON.parse(req.responseText);
			//console.log(JSON.stringify(response));
			response = response[0];
			//console.log(response.name);
//this adds a form w/ info of the row selected filled in - this part works
			var tmpForm = document.createElement("form");
			tmpForm.setAttribute("id","updateExercise");
			tmpForm.setAttribute("name","updateExercise");
			
			var fieldset = document.createElement("fieldset");
			var legend = document.createElement("legend");
			legend.textContent = "Update Exercise";
			
			var xName = document.createElement("p");
			xName.textContent = "Exercise Name: ";
			var nameIn = document.createElement("input");
			nameIn.setAttribute("id", "updateName");
			nameIn.setAttribute("type", "text");
			nameIn.setAttribute("name", "exerciseName");
			nameIn.setAttribute("value", response.name);
			xName.appendChild(nameIn);
			
			var xReps = document.createElement("p");
			xReps.textContent = "Reps: ";
			var repsIn = document.createElement("input");
			repsIn.setAttribute("id", "updateReps");
			repsIn.setAttribute("type", "text");
			repsIn.setAttribute("name", "reps");
			repsIn.setAttribute("value", response.reps);
			xReps.appendChild(repsIn);
			
			var xWeight = document.createElement("p");
			xWeight.textContent = "Weight: ";
			var weightIn = document.createElement("input");
			weightIn.setAttribute("id", "updateWeight");
			weightIn.setAttribute("type", "text");
			weightIn.setAttribute("name", "weight");
			weightIn.setAttribute("value", response.weight);
			var lbsIn = document.createElement("input");
			lbsIn.setAttribute("type", "radio");
			lbsIn.setAttribute("id", "updateLbs");
			lbsIn.setAttribute("name", "updatelbskg");
			lbsIn.setAttribute("value", "1");
			var lbsText = document.createElement("span");
			lbsText.textContent = " lbs. ";
			var kgIn = document.createElement("input");
			kgIn.setAttribute("type", "radio");
			kgIn.setAttribute("id", "updateKg");
			kgIn.setAttribute("name", "updatelbskg");
			kgIn.setAttribute("value", "0");
			var kgText = document.createElement("span");
			kgText.textContent = " kg. ";
			if(response.lbs == 1){
				lbsIn.checked = true;
			}
			if(response.lbs == 0){
				kgIn.checked = true;
			}
			xWeight.appendChild(weightIn);
			xWeight.appendChild(lbsIn);
			xWeight.appendChild(lbsText);
			xWeight.appendChild(kgIn);
			xWeight.appendChild(kgText);
//had issues with date objects and due to limited time I skipped over with intentions of coming back
			var xDate = document.createElement("p");
			xDate.textContent = "Date Performed (month/day/year): "
			
			fieldset.appendChild(legend);
			fieldset.appendChild(xName);
			fieldset.appendChild(xReps);
			fieldset.appendChild(xWeight);
//submit button for update
			var submitUpdate = document.createElement("input");
			submitUpdate.setAttribute("type", "submit");
			submitUpdate.setAttribute("id", "updateSubmit");
			submitUpdate.setAttribute("value", "Update Exercise");
			
			tmpForm.appendChild(fieldset);
			tmpForm.appendChild(submitUpdate);
			
			var bod = document.getElementsByTagName("body");
			bod = bod[0];
			bod.appendChild(tmpForm);
	//this is a listener to the update form.  I would have liked to try a function like I did with other buttons
			document.getElementById("updateSubmit").addEventListener("click", function(event){
				var req = new XMLHttpRequest();
				var updateSubmission = "http://52.33.123.28:3000/safe-update?exerciseName=";
				var updatelbsRadio = document.getElementsByName("updatelbskg");
				var updateweightUnit = null;
				for(var i=0; i<updatelbsRadio.length; i++){
					if(updatelbsRadio[i].checked)
						updateweightUnit = updatelbsRadio[i].value;
				req.open("GET", updateSubmission+document.getElementById("updateName").value+"&reps="+document.getElementById("updateReps").value+"&weight="+document.getElementById("updateWeight").value+"&lbs="+updateweightUnit, true);
					req.addEventListener("load",function(){
						if(req.status >= 200 && req.status < 400){
	//this is where updating the UID should have happened
							var node = document.getElementById(clicked_id).children;
							node[0] = updateName;
							node[1] = updateReps;
							node[2] = updateWeight;
							node[3] = updateweightUnit;
							
							var delForm = document.getElementById("updateExercise");
							if(delForm.parentNode){
								delForm.parentNode.removeChild(node);
							}
						}
						else{//error
							console.log("Error in network request: " + request.statusText);
						}
					});
				}
				req.send(JSON.stringify(req.responseText));
				event.preventDefault();
			});
			
		}
	});
								 
				req.send(JSON.stringify(req.responseText));
				event.preventDefault();
								}

//I think I should of followed this for my update button
function deleteClick(clicked_id){//console.log(clicked_id);
	var req = new XMLHttpRequest();
	var deleteSite = "http://52.33.123.28:3000/delete?id=";
	req.open("GET", deleteSite+clicked_id, true);
	req.addEventListener("load",function(){
		if(req.status >= 200 && req.status < 400){//console.log(clicked_id);
			var node = document.getElementById(clicked_id);
			if (node.parentNode) {
			  node.parentNode.removeChild(node);
			}
			//document.getElementById("wot").removeChild(clicked_id);
		}
		else{//error
			console.log("Error in network request: " + request.statusText);
		}
	});
	req.send(JSON.stringify(req.responseText));
	event.preventDefault();
}
	
