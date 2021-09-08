module.exports = function(app, path, data, saveData){
    app.post("/deleteUser", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        delete data.users[req.body.user];
        saveData(data);
        res.send({});
    });
}