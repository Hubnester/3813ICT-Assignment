module.exports = function(app, dbData){
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

    app.post("/checkUserAuthorised", function(req, res){
        if (!req.body || !req.body.user){
            res.sendStatus(400);
        }

        res.send({"authorised" : checkUserAuthorised(req.body.user)});
    });

    return checkUserAuthorised;
}