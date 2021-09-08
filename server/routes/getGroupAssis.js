module.exports = function(app, path, data){
    app.post("/getGroupAssis", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        var users = {};
        for (var user in data.users){
            for (var j in data.users[user].groupAssisFor){
                if (data.users[user].groupAssisFor[j] == req.body.group){
                    users[user] = true;
                    break;
                } 
            }
        }
        res.send(users);
    });
}