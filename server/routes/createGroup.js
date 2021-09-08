module.exports = function(app, path, data, saveData){
    app.post("/createGroup", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        if (!data.groups[req.body.groupName]){
            data.groups[req.body.groupName] = {"users" : [], "channels" : {}};
        } else{
            return res.send({"alreadyExists" : true});
        }
        saveData(data);
        res.send({});
    });
}