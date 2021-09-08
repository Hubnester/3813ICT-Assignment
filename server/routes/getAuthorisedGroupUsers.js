module.exports = function(app, path, data){
    app.post("/getAuthorisedGroupUsers", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        var users = {};
        for (var i in data.groups[req.body.group].users){
            users[data.groups[req.body.group].users[i]] = true;
        }
        res.send(users);
    });
}