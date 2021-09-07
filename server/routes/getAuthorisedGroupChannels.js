const { group } = require("console");

module.exports = function(app, path){
    var fs = require("fs");

    app.post("/getAuthorisedGroupChannels", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        fs.readFile("./data.json", function(err, data){
            if (err) throw err;
            jsonData = JSON.parse(data);
            authorisedChannels = [];
            for(channelName in jsonData.groups[req.body.groupName].channels){
                for (i in jsonData.groups[req.body.groupName].channels[channelName].users){
                    if (req.body.user == jsonData.groups[req.body.groupName].channels[channelName].users[i]){
                        var channelData = jsonData.groups[req.body.groupName].channels[channelName];
                        channelData.name = channelName;
                        authorisedChannels.push(channelData);
                        break
                    }
                }
            }
            res.send(authorisedChannels);
        })
    });
}