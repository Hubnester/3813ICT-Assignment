module.exports = function(app, path, data, saveData){
    app.post("/deleteChannel", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        data.groups[req.body.groupName].channels[req.body.channelName] = undefined;
        saveData(data);
        res.send({});
    });
}