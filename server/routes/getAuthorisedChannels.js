module.exports = function(app, dbData, data, checkUserAuthorised){
    app.post("/getAuthorisedChannels", async function(req, res){
        if (!req.body || !req.body.user){
            return res.sendStatus(400);
        }

        let authorisedChannels = {};

        let allGroupsVisible = await checkUserAuthorised("groupAdmin", req.body.user);
        // Loop through the groups to check if the user is authorised to access it
        for (let groupName in data.groups){
            if (allGroupsVisible){
                authorisedChannels[groupName] = [];
            } else{
                // Loop through the authorised users to see if the current user is in it
                for (user of data.groups[groupName].users){
                    if (req.body.user == user){
                        authorisedChannels[groupName] = [];
                        break;
                    }
                }
            }

            if (authorisedChannels[groupName]){
                let allChannelsVisible = await checkUserAuthorised("groupAssis", req.body.user, groupName);
                //Loop trhough the channels of the group to check if the user is authorised to access it
                for (let channelName in data.groups[groupName].channels){
                    if (allChannelsVisible){
                        authorisedChannels[groupName].push(channelName);
                    } else{
                        // Loop through the authorised users to see if the current user is in it
                        for (user of data.groups[groupName].channels[channelName].users){
                            if (req.body.user == user){
                                authorisedChannels[groupName].push(channelName);
                                break;
                            }
                        }
                    }
                }

                // Sort the channels
                authorisedChannels[groupName].sort();
            }
        }

        res.send(authorisedChannels);
    });
}