var express = require("express");
var app = express();

var http = require("http").Server(app);
var bodyParser = require("body-parser");
var path = require("path");

var fs = require("fs");

var cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../dist/assignment")));

var dbData = {
	"MongoClient": require("mongodb").MongoClient,
	"url": "mongodb://localhost:27017",
	"name": "3813ICTAssignment"
}

let server = http.listen(3000, function(){
	let host = server.address().address;
	let port = server.address().port;
	console.log("Server listening on: " + host + " port: " + port);
});

var serverData = JSON.parse(fs.readFileSync("./data.json"));
function saveData(){
	fs.writeFile("./data.json", JSON.stringify(serverData), err => {if (err) throw err});
}

// Sort an object based on it's keys
sortObject = (oldObj) => {
	let keys = Object.keys(oldObj);
	keys.sort();
	let newObj = {};
	for (let key of keys){
		newObj[key] = oldObj[key];
	}
	return newObj;
}

var checkUserAuthorised = require("./routes/checkUserAuthorised.js")(app, dbData);

require("./routes/login.js")(app, dbData);
require("./routes/getAuthorisedGroupChannels.js")(app, dbData, checkUserAuthorised, sortObject);
require("./routes/deleteGroupChannel.js")(app, dbData, checkUserAuthorised);
require("./routes/createGroupChannel.js")(app, dbData, checkUserAuthorised);
require("./routes/getAuthorisedGroupChannelUsers")(app, dbData, checkUserAuthorised, sortObject);
require("./routes/addRemoveGroupChannelUser")(app, dbData, checkUserAuthorised);
require("./routes/addRemoveGroupAssis.js")(app, dbData, checkUserAuthorised);

// NOT YET UPDATED ROUTES

require("./routes/getUserRole.js")(app, path, serverData);
require("./routes/getUsers.js")(app, path, serverData);
require("./routes/updateUser.js")(app, path, serverData, saveData);
require("./routes/deleteUser.js")(app, path, serverData, saveData);