module.exports = function(app, path, data, saveData){
    app.post("/createChannel", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        if (!data.groups[req.body.groupName].channels[req.body.channelName]){
            data.groups[req.body.groupName].channels[req.body.channelName] = {"users" : [], "channels" : {}};
        } else{
            return res.send({"alreadyExists" : true});
        }
        saveData(data);
        res.send({});
    });
}