module.exports = function(app, path, data){
    app.post("/auth", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        for(user in data.users){
            if (req.body.username == user){
                return res.send({"user": user});
               }
        }
        res.send({});
    });
}