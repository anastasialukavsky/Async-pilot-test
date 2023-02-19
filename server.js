const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res, next) => {
  try {
    res.redirect(`/${uuidV4()}`);
    console.log("hello from redirect");
  } catch (err) {
    next(err);
  }
});

app.get("/:room", (req, res, next) => {
  // try {
  res.render("room", { roomId: req.params.room });
  console.log("hey from render");
  // } catch (err) {
  //   next(err);
  // }
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log("io connection", roomId, userId);
    // console.log("heyhey");
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });
});
server.listen(3000);
