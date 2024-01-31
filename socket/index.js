import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  // add user

  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    console.log("Connected Users:", onlineUsers);

    // send active users
    io.emit("getUsers", onlineUsers);
  });

  // add event
  socket.on("sendevent", (event) => {
    const user = onlineUsers.find(
      (user) => user.userId === event.recipientId
    );

    if (user) {
      console.log("sending event and notification");
      io.to(user.socketId).emit("getevent", event);
      io.to(user.socketId).emit("getNotification", {
        senderId: event.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected:", onlineUsers);

    // send active users
    io.emit("getUsers", onlineUsers);
  });
});

io.listen(3000);
