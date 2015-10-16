//this function returns the number of properties an object has
function objSize(obj){
    var size = 0, i;
    for (i in obj){
        if (obj.hasOwnProperty(i))
			size++;
    }
    return size;
}

//this function returns boolean of object and all properties are completely equal
//will call itself recursively if the property is an object
function deepEqual(obj1,obj2) {
	//test that the 2 arguments are equal and are not null
    if(typeof(obj1)!=typeof(obj2) || obj1 == null || obj2 == null){
		//console.log("types don't match or one is null");
        return false;
	}
	//test if obj1 is an object, which means obj2 is an object based on previous test
	if(typeof(obj1) == "object"){
		//compare their size by calling objSize function
		if(objSize(obj1) != objSize(obj2)){
			//console.log("size obj1 != size obj2");
			return false;
		}
		//go through the properties in obj1
		for(prop in obj1){
			//console.log(typeof(obj1)+"-"+obj1[prop]+" == object");
			//console.log("obj1-"+prop+" : "+obj1[prop]+" type "+typeof(obj1[prop]));
			//console.log("obj2-"+prop+" : "+obj2[prop]+" type "+typeof(obj2[prop]));
			
			//test the type of the properties are the same
			if(typeof(obj1[prop])!=typeof(obj2[prop])){
				//console.log("typeof obj1 != typeof obj2");
				return false;
			}
			//if the properties are objects, recursive call
			if(typeof(obj1[prop]=="object")){
				//console.log(obj1[prop]+" is an object - calling deepEqual on it");
				if(!deepEqual(obj1[prop],obj2[prop])){
					//console.log("deepEqual returned false");
					return false;
				}
			}
			//console.log("\n");
		}
	}
	//arguments are same type, but not objects
	else{
		//console.log(typeof(obj1)+"-"+obj1+" != object");
		//test they have the same value
		if(obj1 !== obj2){
			//console.log("obj1 !== obj2");
			return false;
		}
	}
	//must be true if it made it to here
	//console.log("deepEqual returning true")
	return true;
}

//testing the function
var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
console.log(deepEqual(true, false));
console.log(deepEqual(2,2));