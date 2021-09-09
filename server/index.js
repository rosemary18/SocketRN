const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors: '*'});
const port = process.env.PORT || 3000;

const users = [];

io.on("connection", socket => {

  console.log("A user connected...");

  // io.emit("ack", "[Server]: Connection succesfully");

  socket.on("messaging", data => {
    console.log(`[${data.user}]: Sending message...`);
    io.emit("messaging", data);
  });

});

server.listen(port, () => console.log(`[${port}]: Server running ...`))