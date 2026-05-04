const express = require("express");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { title: "Hello EJS" });
});

app.listen(3000, () => console.log("http://localhost:3000"));

//
app.get("/api/health", (req, res) => {
    res.json({ ok: true, time: Date.now() });
  });
  
  app.post("/api/echo", (req, res) => {
    res.json({ youSent: req.body });
  });
  