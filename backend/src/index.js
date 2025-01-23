const { Server } = require("socket.io");
const axios = require("axios");

module.exports = {
  register() {},

  bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000", // React frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("message",  (data) => {
        console.log("Message from user:", data);

        io.emit("message", data); 

        
        axios.post('http://127.0.0.1:1337/api/messages', {
          data: { user: data.sender, message: data.text }
        })
          .then(res => {
            console.log('Response:', res.data);
          })
          .catch(err => {
            console.error('Error occurred:', err.response ? err.response.data : err.message);
          });
       
      });
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
    console.log("WebSocket server is running.");
  },
};
