module.exports = function(app, path, data, saveData){
    app.post("/addRemoveGroupUser", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        if (req.body.remove){
            for(i in data.groups[req.body.group].users){
                if (req.body.user == data.groups[req.body.group].users[i]){
                    var tempUserArray = [];
                    for (j in data.groups[req.body.group].users){
                        if (j != i){
                            tempUserArray.push(data.groups[req.body.group].users[j]);
                        }
                    }
                    data.groups[req.body.group].users = tempUserArray;
                    break;
                }
            }
        } else{
            data.groups[req.body.group].users.push(req.body.user)
        }

        saveData(data);
        res.send({});
    });
}