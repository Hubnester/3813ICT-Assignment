var express = require("express");
var app = express();

var http = require("http").Server(app);
var bodyParser = require("body-parser");
var path = require("path");

var cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../dist/assignment")));

let server = http.listen(3000, function(){
	let host = server.address().address;
	let port = server.address().port;
	console.log("Server listening on: " + host + " port: " + port);
});

require("./getData.js")(app, path);