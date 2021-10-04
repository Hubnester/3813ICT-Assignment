module.exports = function(app, dbData, checkUserAuthorised, saveData){
    app.post("/deleteGroupChannel", async function(req, res){
        if (!req.body || !req.body.user || !req.body.groupName){
            return res.sendStatus(400);
        }

        // Check if the supplied user is authorised to delete the group or channel
        let isAuthorised = await checkUserAuthorised("groupAdmin", req.body.user);
        if (!isAuthorised){
            return res.sendStatus(401);
        }

        dbData.MongoClient.connect(dbData.url, async function(err, client){
            if (err) {throw err;}
            let db = client.db(dbData.name);
            let collection = db.collection("groups");

            // Delete the channel if it's supplied, otherwise delete the group
            if (req.body.channelName){
                collection.updateOne({"name": req.body.groupName}, [{"$unset": "channels."+req.body.channelName}]);
            } else {
                collection.deleteOne({"name": req.body.groupName});
            }
        });
        
        res.send({});
    });
}