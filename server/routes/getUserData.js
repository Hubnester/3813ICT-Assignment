module.exports = function(app, dbData){
    app.post("/getUserData", async function(req, res){
        if (!req.body || !req.body.user ){
            return res.sendStatus(400);
        }

        // Connect to the DB
        dbData.MongoClient.connect(dbData.url, async function(err, client){
            if (err) {throw err;}
            let db = client.db(dbData.name);
            let collection = db.collection("users");

            // Get the data for the user
            collection.find({"name": req.body.user}).toArray((err, userData) => {
                if (!userData[0]){
                    client.close();
                    return res.sendStatus(409);
                }
                // Extract only the user data that is needed from the user data form the DB
                let userDataToSend = {
                    "email": userData[0].email,
                    "password": userData[0].password,
                    "profilePic": userData[0].profilePic
                };
                res.send(userDataToSend);
                client.close();
            });
        });
    });
}