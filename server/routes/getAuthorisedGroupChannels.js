module.exports = function(app, path, data){
    app.post("/getAuthorisedGroupChannels", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        authorisedChannels = [];
        for(channelName in data.groups[req.body.groupName].channels){
            // Make super admins and group admins able to see all channels
            if (data.users[req.body.user].role == "superAdmin" || data.users[req.body.user].role == "groupAdmin"){
                authorisedChannels.push(channelName);
                continue;
            }

            for (i in data.groups[req.body.groupName].channels[channelName].users){
                if (req.body.user == data.groups[req.body.groupName].channels[channelName].users[i]){
                    authorisedChannels.push(channelName);
                    break
                }
            }
        }
        authorisedChannels.sort();
        res.send(authorisedChannels);
    });
}