module.exports = function(app, path, data){
    app.post("/getUserRole", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        res.send({"role" : data.users[req.body.user].role, "groupAssisFor":  data.users[req.body.user].groupAssisFor});
    });
}