const { group } = require("console");

module.exports = function(app, path){
    var fs = require("fs");

    app.post("/getAuthorisedGroups", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        fs.readFile("./data.json", function(err, data){
            if (err) throw err;
            jsonData = JSON.parse(data);
            authorisedGroups = [];
            for(groupName in jsonData.groups){
                for (i in jsonData.groups[groupName].users){
                    if (req.body.user == jsonData.groups[groupName].users[i]){
                        var groupData = jsonData.groups[groupName];
                        groupData.name = groupName;
                        authorisedGroups.push(groupData);
                        break
                    }
                }
            }
            res.send(authorisedGroups);
        })
    });
}