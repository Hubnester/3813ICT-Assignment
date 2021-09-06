module.exports = function(app, path){
    var fs = require("fs");

    app.get("/getData", function(req, res){
        fs.readFile("./data.json", function(err, data){
            if (err) throw err;
            res.send(JSON.parse(data));
        })
    });
}