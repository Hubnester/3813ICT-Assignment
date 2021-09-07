module.exports = function(app, path, data){
    app.post("/getAuthorisedGroups", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        authorisedGroups = [];
        for(groupName in data.groups){
            for (i in data.groups[groupName].users){
                if (req.body.user == data.groups[groupName].users[i]){
                    var groupData = data.groups[groupName];
                    groupData.name = groupName;
                    authorisedGroups.push(groupData);
                    break
                }
            }
        }
        res.send(authorisedGroups);
    });
}