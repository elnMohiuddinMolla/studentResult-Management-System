const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { fName, lName, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql =
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [fName, lName, email, hashedPassword], (err) => {
    if (err) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.json({ message: "Registered successfully" });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (results.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(password, results[0].password);

      if (!match) {
        return res.status(401).json({ message: "Wrong password" });
      }

      res.json({ message: "Login successful" });
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
