var assert = require("assert");
var server;
var chai = require("chai");
var chaiHttp = require("chai-http");
var should = chai.should();
chai.use(chaiHttp);

var dbData = {
	"MongoClient": require("mongodb").MongoClient,
	"url": "mongodb://localhost:27017",
	"name": "3813ICTAssignment"
}

describe("Server test", async () => {
	let dbContents = {};
	
	before(() => { return new Promise(async (resolve) => {
		dbData.MongoClient.connect(dbData.url, async function(err, client){
			if (err) {throw err;}
			var db = client.db(dbData.name);
            // Reset the groups collection
			var collection = db.collection("groups");
			collection.find({}).toArray((err, data) => {
				dbContents.groups = data;
			});
			collection.deleteMany({});
            // Reset the users collection
            collection = db.collection("users");
			collection.find({}).toArray((err, data) => {
				dbContents.users = data;
			});
			collection.deleteMany({}, () => {
                // Get the server data and start it (is done here to intialise the super user in the DB)
                server = require("./server.js");
				client.close();
			    resolve();
            });
		});
	});});
	
	after(() => {
		dbData.MongoClient.connect(dbData.url, function(err, client){
			if (err) {throw err;}
			var db = client.db(dbData.name);
            // Restore the groups collection
			var collection = db.collection("groups");
			collection.deleteMany({});
			collection.insertMany(dbContents.groups);
            // Restore the users collection
            var collection = db.collection("users");
			collection.deleteMany({});
			collection.insertMany(dbContents.users, () => {
				client.close();
			});
			server.close();
		});
	});

    describe("/login", () => {
		it("Valid username and password", (done) => {
			chai.request(server).post("/login").send({"username": "super", "password": ""}).end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property("user");
				res.body.user.should.be.eql("super");
				done();
			});
		});
		it("Valid username and invalid password", (done) => {
			chai.request(server).post("/login").send({"username": "super", "password": "pass"}).end((err, res) => {
				res.should.have.status(200);
				res.body.should.not.have.property("user");
				done();
			});
		});
		it("Invalid username", (done) => {
			chai.request(server).post("/login").send({"username": "Not a user"}).end((err, res) => {
				res.should.have.status(200);
				res.body.should.not.have.property("user");
				done();
			});
		});
		it("No username", (done) => {
			chai.request(server).post("/login").send({}).end((err, res) => {
				res.should.have.status(400);
				done();
			});
		});
    });

	describe("/addRemoveUser", () => {
		it("Add valid user as super admin", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "super", "userData": {"name": "group", "email": "group@com.au", "role": "groupAdmin"}}).end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property("success");
				res.body.success.should.be.eql(true);
				done();
			});
		});
		it("Add valid user as group admin", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "group", "userData" : {"name": "user", "email": "user@com.au", "role": "none"}}).end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property("success");
				res.body.success.should.be.eql(true);
				done();
			});
		});
		it("Add valid user as a user with no role", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "user", "userData" : {"name": "validuser", "email": "validuser@com.au", "role": "none"}}).end((err, res) => {
				res.should.have.status(401);
				done();
			});
		});
		it("Add valid user with password supplied", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "super", "userData": {"name": "remove", "password": "pass123", "email": "remove@com.au", "role": "none"}}).end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property("success");
				res.body.success.should.be.eql(true);
				done();
			});
		});
		it("Add duplicate user", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "super", "userData": {"name": "group", "email": "group@com.au", "role": "groupAdmin"}}).end((err, res) => {
				res.should.have.status(409);
				done();
			});
		});
		it("Remove valid user", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "super", "userData" : {"name": "remove"}, "remove": true}).end((err, res) => {
				res.should.have.status(200);
				done();
			});
		});
		it("Remove non-existant user", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "super", "userData" : {"name": "remove"}, "remove": true}).end((err, res) => {
				res.should.have.status(409);
				done();
			});
		});
		it("No supplied requesting user", (done) => {
			chai.request(server).post("/addRemoveUser").send({"userData": {"name": "validuser2", "email": "validuser2@com.au", "role": "none"}}).end((err, res) => {
				res.should.have.status(400);
				done();
			});
		});
		it("No supplied user data", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "super"}).end((err, res) => {
				res.should.have.status(400);
				done();
			});
		});
		it("No supplied username", (done) => {
			chai.request(server).post("/addRemoveUser").send({"user": "super", "userData": {"email": "validuserish@com.au", "role": "none"}}).end((err, res) => {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("/checkUserAuthorised", () => {
		
	});
});