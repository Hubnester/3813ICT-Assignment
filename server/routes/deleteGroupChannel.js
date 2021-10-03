module.exports = function(app, dbData, data, checkUserAuthorised, saveData){
    app.post("/deleteGroupChannel", function(req, res){
        if (!req.body || !req.body.user || !req.body.groupName || !data.groups[req.body.groupName]){
            return res.sendStatus(400);
        }

        // Check if the supplied user is authorised to delete the group or channel
        if (!checkUserAuthorised("groupAdmin", req.body.user)){
            return res.sendStatus(401);
        }

        // Delete the channel if it's supplied, otherwise delete the group
        if (req.body.channelName){
            // Check if the group name was supplied and if the group and channel actually exists
            if (data.groups[req.body.groupName].channels[req.body.channelName]){
                delete data.groups[req.body.groupName].channels[req.body.channelName];
            } else {
                return res.sendStatus(400);
            }
        // Check if the group name was supplied and if that group exists
        } else {
            delete data.groups[req.body.groupName];
        }
        saveData(data);
        
        res.send({});
    });
}