const fs = require("fs");
const https = require("https");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const path = require("path");

const app = express();
app.use(cors());
dotenv.config();
connectDB();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// =========================== delployment starts ===========================

__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static("notezipper_frontend/build"));
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// =========================== delployment ends ============================

const port = process.env.PORT || 443;

const server = https.createServer(
  {
    key: fs.readFileSync(`./localhost+2-key.pem`, "utf8"),
    cert: fs.readFileSync(`./localhost+2.pem`, "utf8"),
  },
  app
);

server.listen(port);
