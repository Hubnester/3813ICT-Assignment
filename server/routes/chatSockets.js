module.exports = function(app, dbData, checkUserAuthorised, io, userRoomConnections){
    io.on("connection", (socket) => {
        // Handle the user joining the channel
        socket.on("join", async (groupName, channelName, user) =>{
            if (!groupName || !channelName || !user){
                // Terminate the connection due to invalid data being sent
                socket.disconnect();
                return;
            }
            let isGroupAdmin = await checkUserAuthorised("groupAdmin", user);
            let isGroupAssis = await checkUserAuthorised("groupAssis", groupName);

            // Connect to the DB
            dbData.MongoClient.connect(dbData.url, async function(err, client){
                if (err) {throw err;}
                let db = client.db(dbData.name);
                let collection = db.collection("groups");
    
                collection.find({"name": groupName}).toArray((err, group) => {
                    if (!group[0] || !group[0].channels[channelName]){
                        // Terminate the connection due to the group or channel not existing
                        socket.disconnect();
                        return;
                    }

                    // Check if the user can access the group (anyone that can add themselves is also considered to have access)
                    if (!group[0].users.find((user) => {return user == user;}) && !isGroupAdmin){
                        socket.disconnect();
                        return;
                    }
                    // Check if the user can access the channel (anyone that can add themselves is also considered to have access)
                    if (!group[0].channels[channelName].users.find((user) => {return user == user;}) && !isGroupAssis){
                        socket.disconnect();
                        return;
                    }

                    // Connect the user socket to the room (the \n is to make it so that you can't have duplicate group + channel room names)
                    let room = groupName+"\n"+channelName;
                    socket.join(room);
                    userRoomConnections[socket.id] = room;
                });
            });
        });

        // Handle the user disconnecting
        socket.on("disconnect", () => {
            delete userRoomConnections[socket.id];
        });

        // Handle the user sending a message
        socket.on("message", (messageData) => {
            if (!messageData.user){
                socket.disconnect();
                return;
            }
            let room = userRoomConnections[socket.id]
            let groupChannel = room.split("\n");
            // Connect to the DB
            dbData.MongoClient.connect(dbData.url, async function(err, client){
                if (err) {throw err;}
                let db = client.db(dbData.name);
                let collection = db.collection("groups");
    
                // Check if the channel exists
                collection.find({"name": groupChannel[0], ["channels."+groupChannel[1]]: {"$exists" : true}}).count((err, count) => {
                    if (count == 1){
                        // Add the message to the channel
                        collection.updateOne({"name": groupChannel[0]}, {"$push": {["channels."+groupChannel[1]+".chat"]: messageData}}, (err, dbres) => {
                            if (err) {throw err;}
                            client.close();
                        });
                    } else{
                        // Terminate the connection since it tried to send a message to a channel that no longer exists
                        socket.disconnect();
                        return;
                    }
                });
            });

            // Send the message to the other users currently in the chat
            io.to(room).emit("message", messageData);
        });
    });
}