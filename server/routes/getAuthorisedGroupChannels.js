module.exports = function(app, path, data){
    app.post("/getAuthorisedGroupChannels", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        console.log(data.groups[req.body.groupName].channels);
        authorisedChannels = [];
        for(channelName in data.groups[req.body.groupName].channels){
            // Fix for undefined when deleting
            if (!data.groups[req.body.groupName].channels[channelName]) {continue;}

            // Make super admins, group admins and group assistants able to see all channels
            if (data.users[req.body.user].role == "superAdmin" || data.users[req.body.user].role == "groupAdmin"
              || data.users[req.body.user].role == "groupAssis"){
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
        res.send(authorisedChannels);
    });
}