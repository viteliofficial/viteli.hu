var lib_version = 0.5;
var developers = ["NetBy"];

var Now_Date = new Date();

console.log(Now_Date.toLocaleString() + " v" + lib_version + " DEV: " + developers)

localStorage.setItem("NetBy-Lib", Now_Date.toLocaleString() + " v" + lib_version + " DEV: " + developers )

//Update


