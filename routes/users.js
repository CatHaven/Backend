var express = require("express");
const mysql = require("mysql2");
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

module.exports = router;
