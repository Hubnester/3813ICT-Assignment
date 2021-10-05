module.exports = function(app, dbData, checkUserAuthorised, sortObject){
    app.post("/getAuthorisedGroupChannelUsers", async function(req, res){
        if (!req.body || !req.body.user || !req.body.groupName){
            return res.sendStatus(400);
        }

        // Check if the user is authorised to get the authorised users for groups and channels
        let isAuthorised = await checkUserAuthorised("groupAssis", req.body.user, req.body.groupName);
        if (!isAuthorised){
            return res.sendStatus(401);
        }
        // Check if the user is authorised to view all members
        let isGroupAdmin = await checkUserAuthorised("groupAdmin", req.body.user);

        // Connect to the DB
        dbData.MongoClient.connect(dbData.url, async function(err, client){
            if (err) {throw err;}
            let db = client.db(dbData.name);
            let groupCollection = db.collection("groups");
            let userCollection = db.collection("users");

            let authorisedUsers = {};
            userCollection.find({}).toArray(async (err, users) => {
                let dbFinished = 0;
                // Loop through each user and check if they are authorised
                for (let user of users){
                    let userAuthorisedGroup = false;
                    groupCollection.find({"name": req.body.groupName}).toArray(async (err, group) => {
                        // Check if the group doesn't exist
                        if (!group[0]){
                            client.close();
                            return res.sendStatus(400);
                        }

                        // Loop through the authorised users of the group to see if any matches the current user
                        for (groupUser of group[0].users){
                            if (user.name == groupUser){
                                userAuthorisedGroup = true;
                                break;
                            }
                        }
                        // Add the user to the authorised users if they are authorised or the requester is a group admin
                        if (isGroupAdmin){
                            let isUserGroupAssis = await checkUserAuthorised("groupAssisExclusive", user.name, req.body.groupName);
                            authorisedUsers[user.name] = {"authorised" : userAuthorisedGroup, "groupAssis": isUserGroupAssis, "channels" : {}};
                        } else if (userAuthorisedGroup){
                            authorisedUsers[user.name] = {"authorised" : true, "channels" : {}};
                        } else {
                            dbFinished++;
                            return;
                        }

                        // Loop through the channels and see if the user is authorised
                        for (channel of Object.keys(group[0].channels)){
                            let userAuthorisedChannel = false;
                            // Loop through the authorised users of the group
                            for (groupUser of group[0].channels[channel].users){
                                if (user.name == groupUser){
                                    userAuthorisedChannel = true;
                                    break;
                                }
                            }
                            authorisedUsers[user.name].channels[channel] = userAuthorisedChannel;
                        }

                        dbFinished++;
                    });
                }

                // Wait for the the DB to finish processing all the users
                while (dbFinished < users.length){
                    await (new Promise(resolve => setTimeout(resolve, 1)));
                }

                res.send(sortObject(authorisedUsers));
                client.close();
            });
        });
    });
}