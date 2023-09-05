const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs").promises;

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "/views/login.html"));
});

app.post("/login", (req, res, next) => {
  res.status(301).redirect("/");
});

app.get("/", async (req, res, next) => {
  try {
    // Read the messages from the file
    const messages = await fs.readFile(
      path.join(__dirname, "messages.txt"),
      "utf-8"
    );
    // Render the home page and pass the messages to it
    res.render("home", { messages });
  } catch (err) {
    console.error("Error reading messages:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/submit", async (req, res, next) => {
  const data = req.body;
  const newMessage = `${data.name}:${data.message}`;
  const existingMessages = await fs.readFile(
    path.join(__dirname, "messages.txt"),
    "utf-8"
  );
  const updatedMessages = existingMessages + "\n" + newMessage;
  await fs.writeFile(path.join(__dirname, "messages.txt"), updatedMessages);
  res.status(201).json({
    success: true,
  });
});

app.listen(4000, () => console.log("Server is Running!"));
