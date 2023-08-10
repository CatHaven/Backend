var express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
var router = express.Router();
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.HOST,
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: 3306,
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
router.get("/cats", async function (req, res, next) {
  connection.query("SELECT * FROM Cat", (err, results, fields) => {
    if (err) {
      console.error("Error executing", err);
      return;
    }
    res.send(results);
  });
});
router.get("/cat/:name", async function (req, res, next) {
  connection.query(
    `SELECT * FROM Cat where CatName = '${req.params.name}'`,
    (err, results, fields) => {
      if (err) {
        console.error("Error executing", err);
        return;
      }
      res.send(results[0]);
    }
  );
});
router.get("/catweek", async function (req, res, next) {
  connection.query(
    "SELECT * FROM Cat where CatName = 'Phoenix'",
    (err, results, fields) => {
      if (err) {
        console.error("Error executing", err);
        return;
      }
      res.send(results);
    }
  );
});
function generateAuthToken(user) {
  const payload = {
    username: user.username,
    email: user.email,
    iat: Math.floor(Date.now() / 1000), // Issued at timestamp
  };

  return jwt.sign(payload, process.env.KEY);
}

router.get("/account", async function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401);
  }
  const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.KEY);
  console.log(decoded);
  res.json(decoded);
});

router.post("/register", async function (req, res, next) {
  const data = req.body;
  connection.query(
    `INSERT INTO users(username, password, email) VALUES ("${data.username}", "${data.password}", "${data.email}")`,
    (err, results, fields) => {
      if (err) {
        console.error("Error executing", err);
        return;
      }
      res.send(results);
    }
  );
});

router.post("/login", async function (req, res, next) {
  const data = req.body;
  connection.query(
    `SELECT * FROM users where username = "${data.username}"`,
    (err, results, fields) => {
      if (err) {
        console.error("Error executing", err);
        return;
      }
      const token = generateAuthToken(results[0]);
      if (results[0].password === data.password) {
        res.json({ token });
      } else {
        res.status(401);
      }
    }
  );
});

module.exports = router;
