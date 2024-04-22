const express = require("express");
const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io")
const io = new Server(server);
const { addUser,getUser, removeUser } = require("./utils/users");

app.get("/",(req,res,next)=>{
    res.send("home page route");
});
// io.on("connection", (socket)=>{
//     socket.on("userJoined",(data)=>{
//         const {name, userId, roomId, host, presenter} = data;
//         socket.join(roomId);
//         socket.emit("userIsJoined",{success:true})
//     })
// });
let roomIdGlobal, imgURLGlobal;
io.on("connection", (socket) => {
    socket.on("userJoined", (data) => {
      const { roomId, userId, name, host, presenter } = data;
      const users = addUser({name, roomId, userId, host, presenter, socketId:socket.id});
      // const roomUsers = getUser(user.room);
      roomIdGlobal=roomId;
      socket.join(roomId);
      socket.emit("userIsJoined",{success:true, users})
      socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted",name)
      socket.broadcast.to(roomId).emit("allUsers",users)
      socket.broadcast.to(roomId).emit("whiteboardDataResponse",{imgURL: imgURLGlobal});
    });
    socket.on("whiteboardData", (data) => {
      const { roomId, userId, name, host, presenter } = data;
      imgURLGlobal = data;
      socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse",{imgURL: data});
    });
    socket.on("message", (data) => {
      const {message} = data;
      const user = getUser(socket.id)
      console.log("user1",user,message)
      if(user){
        // removeUser(socket.id)
        socket.broadcast.to(roomIdGlobal).emit("messageResponse",{message, name:user.name});
      }
    });
    socket.on("disconnect", () => {
      console.log("userleft runninng 1",socket.id)
      const user = getUser(socket.id)
      console.log("user",user)
      if(user){
        removeUser(socket.id)
        socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted",user.name);
      }
    });
  });
const port = process.env.PORT || 5000;
server.listen(port,()=>{
    console.log(`server is running on ${port}`)
});
