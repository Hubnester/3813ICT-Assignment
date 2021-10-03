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
let checkUserAuthorised = (minRole, user, group = null) => {
	// Lambda function for checking if the user is a group assistant of the supplied group
	let checkGroupAssis = () => {
		for (let groupAssisOf of serverData.users[user].groupAssisFor){
			if (groupAssisOf == group){
				return true;
			}
			return false;
		}
	}
	// Check if the user meets the min role requirement
	if (minRole == "superAdmin" && serverData.users[user].role == "superAdmin"){
		return true;
	} else if (minRole == "groupAdmin" && (serverData.users[user].role == "superAdmin" || serverData.users[user].role == "groupAdmin")){
		return true;
	} else if (group && minRole == "groupAssis" && (serverData.users[user].role == "superAdmin" || serverData.users[user].role == "groupAdmin" || checkGroupAssis())){
		return true;
	}
	return false;
}

// NOT YET USING MONGODB ROUTES

require("./routes/deleteGroupChannel.js")(app, serverData, checkUserAuthorised, saveData);

// NOT YET CONVERTED TO CHECK USER AUTH ROUTES

require("./routes/auth.js")(app, path, serverData);
require("./routes/getUserRole.js")(app, path, serverData);
require("./routes/getAuthorisedGroups.js")(app, path, serverData);
require("./routes/getAuthorisedGroupChannels.js")(app, path, serverData);
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