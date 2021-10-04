module.exports = function(app, dbData, checkUserAuthorised){
    app.post("/createGroupChannel", async function(req, res){
        if (!req.body || !req.body.user || !req.body.groupName){
            return res.sendStatus(400);
        }

        // Check if the supplied user is authorised to delete the group or channel
        let isAuthorised = false;
        // If a channel is being created, check if the user is a group assis, otherwise check if they are a group admin
        if (req.body.channelName){
            isAuthorised = await checkUserAuthorised("groupAssis", req.body.user, req.body.groupName);
        } else {
            isAuthorised = await checkUserAuthorised("groupAdmin", req.body.user);
        }
        if (!isAuthorised){
            return res.sendStatus(401);
        }

        dbData.MongoClient.connect(dbData.url, async function(err, client){
            if (err) {throw err;}
            let db = client.db(dbData.name);
            let collection = db.collection("groups");

            // Create the channel if it's supplied, otherwise create the group
            if (req.body.channelName){
                // Check if the channel already exists
                collection.find({["channels."+req.body.channelName]: {"$exists" : true}}).count((err, count) => {
                    if (count == 0){
                        // Create the new channel
                        collection.updateOne({"name": req.body.groupName}, [{"$set": {["channels."+req.body.channelName]: {"users" : [], "chat" : []}}}], (err, dbres) => {
                            if (err) {throw err;}
                            res.send({});
                        });
                    } else{
                        res.sendStatus(409);
                    }
                });
            } else {
                // Check if a group with that name doesn't already exist
                collection.find({"name": req.body.groupName}).count((err, count) => {
                    if (count == 0){
                        // Create the new group
                        collection.insertOne({"name": req.body.groupName, "users": [], "channels": {}}, (err, dbres) => {
                            if (err) {throw err;}
                            res.send({});
                        });
                    } else{
                        res.sendStatus(409);
                    }
                });
            }
        });
    });
}

//module.exports = function(app, path, data, saveData){
//    app.post("/createGroup", function(req, res){
//        if (!req.body){
//            return res.sendStatus(400);
//        }
//
//        if (!data.groups[req.body.groupName]){
//            data.groups[req.body.groupName] = {"users" : [], "channels" : {}};
//        } else{
//            return res.send({"alreadyExists" : true});
//        }
//        saveData(data);
//        res.send({});
//    });
//}

//module.exports = function(app, path, data, saveData){
//    app.post("/createChannel", function(req, res){
//        if (!req.body){
//            return res.sendStatus(400);
//        }
//
//        if (!data.groups[req.body.groupName].channels[req.body.channelName]){
//            data.groups[req.body.groupName].channels[req.body.channelName] = {"users" : [], "chat" : []};
//        } else{
//            return res.send({"alreadyExists" : true});
//        }
//        saveData(data);
//        res.send({});
//    });
//}