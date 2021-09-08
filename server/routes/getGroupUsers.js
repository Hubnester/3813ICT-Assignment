module.exports = function(app, path, data){
    app.post("/getGroupUsers", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        var users = [];
        for (var i in data.groups[req.body.group].users){
            var userData = {};
            userData.name = data.groups[req.body.group].users[i];
            users.push(userData);
        }
        users.sort((first, second) => {
            if (first.name > second.name){
                return 1;
            } else if (first.name < second.name){
                return -1;
            }
            return 0;
        });
        res.send(users);
    });
}