module.exports = function(app, path, data){
    app.get("/getUsers", function(req, res){
        var users = [];
        for (var user in data.users){
            var userData = data.users[user];
            userData.name = user;
            users.push(userData);
        }
        users.sort((first, second) => {
            if (first.name > second.name){
                return 1;
            } else if (first.name < second.name){
                return -1;
            }
            return 0;
        });
        res.send(users);
    });
}