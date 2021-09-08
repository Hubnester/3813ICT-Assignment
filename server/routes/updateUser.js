module.exports = function(app, path, data, saveData){
    app.post("/updateUser", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        if (!req.body.new || !data.users[req.body.user.username]){
            data.users[req.body.user.username] = req.body.user;
            delete data.users[req.body.user.username].username;
        } else {
            return res.send({"alreadyExists" : true});
        }

        saveData(data);
        res.send({});
    });
}