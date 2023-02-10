const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.options("*", cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/"));
app.get("/", async (req, res) => {
  res.render("mcqForm");
});
app.post("/", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});
app.listen(4000);
console.log("Server @ port 4000");
