const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketIO(server);

// Handle Socket.IO connections
io.on("connection", (socket) => {
    
    // Optional: Handle disconnection
    socket.on("send-location", (data) => {
        io.emit("receive-location",{id:socket.id,...data})
    });

    socket.on("disconnect",()=>{
        io.emit("user-disconnected",socket.id)

    })
    console.log("User connected:", socket.id);
});

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the home page
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
server.listen(4000, () => {
    console.log("Server is running on port 4000");
});
