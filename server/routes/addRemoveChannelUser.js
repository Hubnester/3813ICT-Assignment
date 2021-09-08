module.exports = function(app, path, data, saveData){
    app.post("/addRemoveChannelUser", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        if (req.body.remove){
            for(i in data.groups[req.body.group].channels[req.body.channel].users){
                if (req.body.user == data.groups[req.body.group].channels[req.body.channel].users[i]){
                    var tempUserArray = [];
                    for (j in data.groups[req.body.group].channels[req.body.channel].users){
                        if (j != i){
                            tempUserArray.push(data.groups[req.body.group].channels[req.body.channel].users[j]);
                        }
                    }
                    data.groups[req.body.group].channels[req.body.channel].users = tempUserArray;
                    break;
                }
            }
        } else{
            data.groups[req.body.group].channels[req.body.channel].users.push(req.body.user);
        }

        saveData(data);
        res.send({});
    });
}