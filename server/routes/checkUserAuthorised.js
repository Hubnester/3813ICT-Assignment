module.exports = function(app, dbData){
    // Function for getting the user role
    let checkUserAuthorised = async (minRole, username, group = null) => {
        let retVal = undefined;
        
        // Connect to the database
        dbData.MongoClient.connect(dbData.url, function(err, client){
            if (err) {throw err;}
            let db = client.db(dbData.name);
            let collection = db.collection("users");
            collection.find({"name": username}).toArray((err, user) => {
                // Check if the user doesn't exist
                if (!user[0]){
                    client.close();
                    retVal = false;
                    return;
                }

                // Lambda function for checking if the user is a group assistant of the supplied group
                let checkGroupAssis = () => {
                    for (let groupAssisOf of (user[0].groupAssisFor)){
                        if (group == groupAssisOf){
                            return true;
                        }
                    }
                    return false;
                }
                // Check if the user meets the min role requirement
                if (minRole == "superAdmin" && user[0].role == "superAdmin"){
                    retVal = true;
                } else if (minRole == "groupAdmin" && (user[0].role == "superAdmin" || user[0].role == "groupAdmin")){
                    retVal = true;
                } else if (group && minRole == "groupAssis" && (user[0].role == "superAdmin" || user[0].role == "groupAdmin" || checkGroupAssis())){
                    retVal = true;
                } else if (group && minRole == "groupAssisExclusive" && checkGroupAssis()){
                    retVal = true;
                }else {
                    retVal = false;
                }

                client.close();
            });
        });
        // Wait for the the retVal to be gotten from the DB
        while (retVal == undefined){
            await (new Promise(resolve => setTimeout(resolve, 1)));
        }
        return retVal;
    }

    app.post("/checkUserAuthorised", async function(req, res){
        if (!req.body || !req.body.minRole || !req.body.user){
            res.sendStatus(400);
        }

        // Get whether the user is authorised
        let authorised = await checkUserAuthorised(req.body.minRole, req.body.user, req.body.groupName);

        res.send({"authorised" : authorised});
    });

    return checkUserAuthorised;
}