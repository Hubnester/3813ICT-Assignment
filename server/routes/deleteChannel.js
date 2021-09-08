module.exports = function(app, path, data, saveData){
    app.post("/deleteChannel", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        delete data.groups[req.body.groupName].channels[req.body.channelName];
        saveData(data);
        res.send({});
    });
}