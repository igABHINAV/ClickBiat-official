const http = require('http');
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
require("dotenv").config({ path: "./config/config.env" });
const { Server } = require("socket.io");


app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors());

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*"
    }
})





// -------------------------------------------------------------------------------------------------
//USING WEBSOCKETS
const rooms = {};

io.on("connection", (socket) => {

    socket.on("join_room", (data) => {
        const room = data;
        if (!rooms[room]) {
            rooms[room] = {
                users: [socket.id],
                power: 50, // Set initial power value to 50
            };
            socket.join(room);
            socket.emit("room_joined", { room: room });
        } else if (rooms[room].users.length < 2) {
            rooms[room].users.push(socket.id);
            socket.join(room);
            socket.emit("room_joined", { room: room });
        } else {
            // Room is full, handle it here (e.g., notify the user).
            socket.emit("room_full", { room: room });
        }
    });

    socket.on("send_message", (data) => {
        if (rooms[data.room] && rooms[data.room].users.includes(socket.id)) {
            const sender = socket.id;

            // Emit the message to the receiver
            // io.to(receiver).emit("receive_message", data);

            // Update power based on the sender
            if (sender === rooms[data.room].users[0]) {
                rooms[data.room].power += 2;
            } else {
                rooms[data.room].power -= 2;
            }

            // Emit the updated power to both users
            io.to(data.room).emit("power_update", { power: rooms[data.room].power });

            // Check if the power reaches 100 or 0 and handle the user win
            if (rooms[data.room].power >= 100) {
                io.to(data.room).emit("user_win", { room: data.room, username: data.username });
                rooms[data.room].power = 50; // Reset the power to 50
                io.to(data.room).emit("power_update", { power: rooms[data.room].power }); // Emit the reset power value
            } else if (rooms[data.room].power <= 0) {
                const winningUsername = rooms[data.room].users.find((user) => user !== sender);
                io.to(data.room).emit("user_win2", { room: data.room, username: winningUsername });
                rooms[data.room].power = 50; // Reset the power to 50
                io.to(data.room).emit("power_update", { power: rooms[data.room].power }); // Emit the reset power value
            }
        } else {
            // User is not a member of the room, handle it here (e.g., notify the user).
            console.log(`You are not a member of the room ${data.room}.`);
        }
    });

    socket.on("disconnect", () => {
        for (const room in rooms) {
            const index = rooms[room].users.indexOf(socket.id);
            if (index !== -1) {
                rooms[room].users.splice(index, 1);
            }
        }
    });

    socket.on("server_disconnect", () => {
        socket.disconnect();
    });
});
// -------------------------------------------------------------------------------------------------


module.exports = server;