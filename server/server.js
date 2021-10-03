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

// Function for getting the user role
let checkUserAuthorised = async (minRole, userName, group = null) => {
	let retVal = undefined;
	// Connect to the database
	dbData.MongoClient.connect(dbData.url, function(err, client){
		if (err) {throw err;}
		let db = client.db(dbData.name);
		let collection = db.collection("users");
		collection.find({"name": userName}).toArray((err, user) => {
			// Close the db since we have what we need from it
			client.close();

			// Lambda function for checking if the user is a group assistant of the supplied group
			let checkGroupAssis = () => {
				for (let groupAssisOf of user[0].groupAssisFor){
					if (group == groupAssisOf){
						return true;
					}
					return false;
				}
			}
			// Check if the user meets the min role requirement
			if (minRole == "superAdmin" && user[0].role == "superAdmin"){
				retVal = true;
			} else if (minRole == "groupAdmin" && (user[0].role == "superAdmin" || user[0].role == "groupAdmin")){
				retVal = true;
			} else if (group && minRole == "groupAssis" && (user[0].role == "superAdmin" || user[0].role == "groupAdmin" || checkGroupAssis())){
				retVal = true;
			} else {
				retVal = false;
			}
			client.close();
		});
	});
	// Wait for the the retVal to be gotten from the DB
	while (retVal == undefined){
		await (new Promise(resolve => setTimeout(resolve, 100)));
	}
	return retVal;
}

require("./routes/deleteGroupChannel.js")(app, dbData, serverData, checkUserAuthorised, saveData);
require("./routes/getAuthorisedChannels")(app, dbData, serverData, checkUserAuthorised)

// NOT YET CONVERTED TO CHECK USER AUTH ROUTES

require("./routes/auth.js")(app, path, serverData);
require("./routes/getUserRole.js")(app, path, serverData);
require("./routes/createChannel.js")(app, path, serverData, saveData);
require("./routes/createGroup.js")(app, path, serverData, saveData);
require("./routes/getUsers.js")(app, path, serverData);
require("./routes/updateUser.js")(app, path, serverData, saveData);
require("./routes/deleteUser.js")(app, path, serverData, saveData);
require("./routes/getAuthorisedGroupUsers.js")(app, path, serverData);
require("./routes/addRemoveGroupUser.js")(app, path, serverData, saveData);
require("./routes/getGroupAssis.js")(app, path, serverData);
require("./routes/addRemoveGroupAssis.js")(app, path, serverData, saveData);
require("./routes/getGroupUsers.js")(app, path, serverData);
require("./routes/getAuthorisedChannelUsers.js")(app, path, serverData);
require("./routes/addRemoveChannelUser.js")(app, path, serverData, saveData);