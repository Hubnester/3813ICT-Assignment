module.exports = function(app, path, data){
    app.get("/getUsers", function(req, res){
        var users = [];
        for (user in data.users){
            var userData = data.users[user];
            userData.name = user;
            users.push(userData);
        }
        users.sort();
        res.send(users);
    });
}