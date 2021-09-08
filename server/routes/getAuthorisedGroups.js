module.exports = function(app, path, data){
    app.post("/getAuthorisedGroups", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        authorisedGroups = [];
        for(groupName in data.groups){
            // Fix for undefined when deleting
            if (!data.groups[groupName]){continue;}

            // Make super admins and group admins able to see all goups
            if (data.users[req.body.user].role == "superAdmin" || data.users[req.body.user].role == "groupAdmin"){
                authorisedGroups.push(groupName);
                continue;
            }
            
            for (i in data.groups[groupName].users){
                if (req.body.user == data.groups[groupName].users[i]){
                    authorisedGroups.push(groupName);
                    break
                }
            }
        }
        res.send(authorisedGroups);
    });
}