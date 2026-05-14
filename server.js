const express = require("express");
const Datastore = require("nedb");
const products = require("./data/products");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const usersDB = new Datastore({ filename: "users.db", autoload: true });
const ordersDB = new Datastore({ filename: "orders.db", autoload: true });

/* =========================
   PRODUCTS (catalog)
========================= */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/* =========================
   USERS
========================= */
app.post("/api/users/register", (req, res) => {
  usersDB.insert(req.body, (err, doc) => res.json(doc));
});

app.post("/api/users/login", (req, res) => {
  usersDB.findOne(
    { email: req.body.email, password: req.body.password },
    (err, user) => {
      if (!user) return res.status(401).json({ error: "Failed" });
      res.json(user);
    },
  );
});

/* =========================
   ORDERS (saved builds)
========================= */
app.post("/api/orders", (req, res) => {
  ordersDB.insert(req.body, (err, doc) => res.json(doc));
});

app.get("/api/orders", (req, res) => {
  ordersDB.find({ userEmail: req.query.email }, (err, docs) => {
    res.json(docs);
  });
});

/* =========================
   SERVER START
========================= */
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
