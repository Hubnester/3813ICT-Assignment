var express = require("express");
var app = express();

var http = require("http").Server(app);
var bodyParser = require("body-parser");
var path = require("path");

var cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../dist/assignment")));

// The data for the DB
var dbData = {
	"MongoClient": require("mongodb").MongoClient,
	"url": "mongodb://localhost:27017",
	"name": "3813ICTAssignment"
}

// Initialise the sockect io
var io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "Post"]
    }
});

// Start the server
let server = http.listen(3000, function(){
	let host = server.address().address;
	let port = server.address().port;
	console.log("Server listening on: " + host + " port: " + port);
});

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

var userRoomConnections = {};

var checkUserAuthorised = require("./routes/checkUserAuthorised.js")(app, dbData);
var placeholderProfilePic = require("./placeholderProfilePic");

require("./routes/login.js")(app, dbData);
require("./routes/getAuthorisedGroupChannels.js")(app, dbData, checkUserAuthorised, sortObject);
require("./routes/deleteGroupChannel.js")(app, dbData, checkUserAuthorised);
require("./routes/createGroupChannel.js")(app, dbData, checkUserAuthorised);
require("./routes/getAuthorisedGroupChannelUsers")(app, dbData, checkUserAuthorised, sortObject);
require("./routes/addRemoveGroupChannelUser")(app, dbData, checkUserAuthorised);
require("./routes/addRemoveGroupAssis.js")(app, dbData, checkUserAuthorised);
require("./routes/getUsers.js")(app, dbData, checkUserAuthorised);
require("./routes/updateUser.js")(app, dbData, checkUserAuthorised);
require("./routes/addRemoveUser.js")(app, dbData, checkUserAuthorised, placeholderProfilePic);
require("./routes/getUserData.js")(app, dbData);
require("./routes/getChat.js")(app, dbData, checkUserAuthorised);
require("./routes/getProfilePics.js")(app, dbData);
require("./routes/chatSockets.js")(app, dbData, checkUserAuthorised, io, userRoomConnections);