module.exports = function(app, path, data, saveData){
    app.post("/addRemoveGroupAssis", function(req, res){
        if (!req.body){
            return res.sendStatus(400);
        }

        data.users[req.body.user].groupAssisFor = data.users[req.body.user].groupAssisFor || [];
        if (req.body.remove){
            for(i in data.users[req.body.user].groupAssisFor){
                if (req.body.group == data.users[req.body.user].groupAssisFor[i]){
                    var tempGroupAssisForArray = [];
                    for (j in data.users[req.body.user].groupAssisFor){
                        if (j != i){
                            tempGroupAssisForArray.push(data.users[req.body.user].groupAssisFor[j]);
                        }
                    }
                    data.users[req.body.user].groupAssisFor = tempGroupAssisForArray;
                    break;
                }
            }
        } else{
            data.users[req.body.user].groupAssisFor.push(req.body.group);
        }

        saveData(data);
        res.send({});
    });
}