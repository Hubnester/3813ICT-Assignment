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

require("./routes/auth.js")(app, path, serverData);
require("./routes/getUserRole.js")(app, path, serverData);
require("./routes/getAuthorisedGroups.js")(app, path, serverData);
require("./routes/getAuthorisedGroupChannels.js")(app, path, serverData);
require("./routes/deleteChannel.js")(app, path, serverData, saveData);
require("./routes/createChannel.js")(app, path, serverData, saveData);