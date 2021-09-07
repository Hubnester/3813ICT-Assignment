module.exports = function(app, path, data){
    app.post("/getAuthorisedGroupChannels", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        authorisedChannels = [];
        for(channelName in data.groups[req.body.groupName].channels){
            for (i in data.groups[req.body.groupName].channels[channelName].users){
                if (req.body.user == data.groups[req.body.groupName].channels[channelName].users[i]){
                    var channelData = data.groups[req.body.groupName].channels[channelName];
                    channelData.name = channelName;
                    authorisedChannels.push(channelData);
                    break
                }
            }
        }
        res.send(authorisedChannels);
    });
}