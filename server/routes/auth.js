module.exports = function(app, path){
    var fs = require("fs");

    app.post("/auth", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        fs.readFile("./data.json", function(err, data){
            if (err) throw err;
            jsonData = JSON.parse(data);
            for(user in jsonData.users){
                if (req.body.username == user){
                    res.send({"user": user});
                }
            }
        })
    });
}