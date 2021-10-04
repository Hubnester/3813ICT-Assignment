module.exports = function(app, dbData, checkUserAuthorised){
    app.post("/getAuthorisedChannels", async function(req, res){
        if (!req.body || !req.body.user){
            return res.sendStatus(400);
        }

        // Connect to the database
        dbData.MongoClient.connect(dbData.url, async function(err, client){
            if (err) {throw err;}
            let db = client.db(dbData.name);
            let collection = db.collection("groups");
            collection.find().toArray(async (err, groups) => {
                let authorisedChannels = {};

                let allGroupsVisible = await checkUserAuthorised("groupAdmin", req.body.user);
                // Loop through the groups to check if the user is authorised to access it
                for (let i in groups){
                    if (allGroupsVisible){
                        authorisedChannels[groups[i].name] = [];
                    } else{
                        // Loop through the authorised users to see if the current user is in it
                        for (user of groups[i].users){
                            if (req.body.user == user){
                                authorisedChannels[groups[i].name] = [];
                                break;
                            }
                        }
                    }

                    if (authorisedChannels[groups[i].name]){
                        let allChannelsVisible = await checkUserAuthorised("groupAssis", req.body.user, groups[i].name);
                        //Loop trhough the channels of the group to check if the user is authorised to access it
                        for (let channelName in groups[i].channels){
                            if (allChannelsVisible){
                                authorisedChannels[groups[i].name].push(channelName);
                            } else{
                                // Loop through the authorised users to see if the current user is in it
                                for (user of groups[i].channels[channelName].users){
                                    if (req.body.user == user){
                                        authorisedChannels[groups[i].name].push(channelName);
                                        break;
                                    }
                                }
                            }
                        }

                        // Sort the channels
                        authorisedChannels[groups[i].name].sort();
                    }
                }

                res.send(authorisedChannels);
                client.close();
            });
        });
    });
}