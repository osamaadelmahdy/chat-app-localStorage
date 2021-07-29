const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const { userJoin, getCurentUser, getusers, deleteUser } = require("./user");
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, "public")));
const io = socketio(server);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  console.log("new connection", id);

  socket.on("joinRoom", ({ username, room }) => {
    if (!username) socket.emit("redirect", "http://localhost:3000/");
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    const message = `${user.username} has joined to ${user.room} room`;
    socket.broadcast.to(user.room).emit("chatMsg", { msg: message });
    io.to(user.room).emit("users", {
      room: user.room,
      users: getusers(user.room),
    });
  });

  socket.on("disconnect", () => {
    const user = getCurentUser(socket.id);
    console.log(user);
    if (!user) {
      io.emit("redirect", "http://localhost:3000/");
    } else {
      const message = `${user.username} has left`;
      io.emit("chatMsg", { msg: message });
      console.log("id", user.id);
      deleteUser(user.id);

      io.to(user.room).emit("users", {
        room: user.room,
        users: getusers(user.room),
      });
    }
  });
  socket.on("chatMsg", (msg) => {
    const user = getCurentUser(socket.id);
    if (!user) socket.emit("redirect", "http://localhost:3000/");
    const message = `${user.username}: ${msg}`;
    io.to(user.room).emit("chatMsg", { msg: message, name: user.username });
    //
  });
});

server.listen(3000, () => console.log("server run... "));

// const io = require("socket.io")(5000, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connection");
//   const id = socket.handshake.query.id;
//   console.log("id", id);
//   socket.join(id);
//   socket.on("send message", ({ ids, text }) => {
//     console.log("ids text", ids, text);
//     ids.forEach((id) => {
//       const newIds = ids.filter((r) => r !== id);
//       newIds.push(id);
//       console.log("broadcast", newIds, text, id);
//       socket.broadcast
//         .to(id)
//         .emit("receive-message", { newIds, sendr: id, text });
//     });
//   });
// });
