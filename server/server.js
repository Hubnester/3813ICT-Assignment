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

var checkUserAuthorised = require("./routes/checkUserAuthorised.js")(app, dbData);

require("./routes/getAuthorisedChannels.js")(app, dbData, checkUserAuthorised)
require("./routes/deleteGroupChannel.js")(app, dbData, checkUserAuthorised, saveData);

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