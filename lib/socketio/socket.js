const { Server } = require("socket.io");
const http = require("http");
const app = require("../../app");

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", async (socket) => {
  await socket.join("soporte");

  socket.on("client:send-message", (payload) => {
    io.to("soporte").emit("server:send-message", { ...payload, id: socket.id });
  });

  socket.on("client:respond", (payload) => {
    io.to(payload.id).emit("server:respond", { message: payload.message });
  });
});

module.exports = { server, io };
