module.exports = function(app, path, data, saveData){
    app.post("/deleteGroup", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        delete data.groups[req.body.groupName];
        saveData(data);
        res.send({});
    });
}