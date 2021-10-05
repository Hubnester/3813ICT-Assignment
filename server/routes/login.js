module.exports = function(app, dbData){
    app.post("/login", function(req, res){
        if (!req.body || !req.body.username){
            return res.sendStatus(400);
        }

        // Connect to the DB
        dbData.MongoClient.connect(dbData.url, async function(err, client){
            if (err) {throw err;}
            let db = client.db(dbData.name);
            let collection = db.collection("users");
            // Check if a user with the supplied name and password exists
            collection.find({"name": req.body.username, "password": req.body.password}).count((err, count) => {
                if (count == 1){
                    res.send({"user": req.body.username});
                } else {
                    res.send({});
                }
            });
        });
    });
}