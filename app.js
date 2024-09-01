import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import dotenv from "dotenv"
import { title } from "process";

dotenv.config({ path: "./.env" })

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("intro", {
        title: "Hello World!",
    })
})

app.get("/map", (req, res) => {
    res.render("home");
});

server.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id)
    })
});
