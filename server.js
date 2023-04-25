require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const server = require("http").createServer(app);
const axios = require('axios');

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")))

io.on("connection", function(socket){
    socket.on("newuser",function(username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser",function(username){
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat",function(message){
        const recipientMessage = {message: message.text};
        const apiUrl = 'https://xyr7no9012.execute-api.ap-northeast-1.amazonaws.com/chatapi/chat';
        axios.post(apiUrl, recipientMessage )
            .then(response => {
                const redactedMessage = response.data.response;
                message.text = redactedMessage;
                socket.broadcast.emit("chat", message);
    })
            .catch(error => {
                // Handle any errors that may occur during the API request
                console.error('Error:', error);
            });
        //socket.broadcast.emit("chat", message);
    });
});
server.listen(PORT);

