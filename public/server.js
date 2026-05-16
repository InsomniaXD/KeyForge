const express = require("express");
const path = require("path");
const Datastore = require("@seald-io/nedb");
const products = require("../data/products");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Initialize Databases
const usersDB = new Datastore({ filename: "users.db", autoload: true });
const ordersDB = new Datastore({ filename: "orders.db", autoload: true });
const countersDB = new Datastore({ filename: "counters.db", autoload: true }); // New DB for safe sequential IDs

/* =========================
   PRODUCTS (catalog)
========================= */
app.get("/api/products", (req, res) => {
  if (!products)
    return res
      .status(500)
      .json({ error: "Product catalog missing on server." });
  res.json(products);
});

/* =========================
   USERS
========================= */
app.post("/api/users/register", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  usersDB.findOne({ email }, (err, existing) => {
    if (existing)
      return res.status(409).json({ error: "Email already in use." });

    usersDB.insert(req.body, (err, doc) => {
      if (err) return res.status(500).json({ error: "Registration failed." });
      const { password, ...safeUser } = doc;
      res.json(safeUser);
    });
  });
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  usersDB.findOne({ email, password }, (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const { password: _pw, ...safeUser } = user;
    res.json(safeUser);
  });
});

app.put("/api/users/update", (req, res) => {
  const { email, firstName, lastName } = req.body;
  usersDB.update({ email }, { $set: { firstName, lastName } }, {}, (err, n) => {
    if (err || n === 0)
      return res.status(500).json({ error: "Update failed." });
    res.json({ ok: true });
  });
});

/* =========================
   ORDERS & CHECKOUT
========================= */

// Helper: Safely generate sequential order IDs (e.g., 1, 2, 3)
function getNextOrderId(callback) {
  countersDB.update(
    { _id: "orderId" },
    { $inc: { seq: 1 } },
    { upsert: true, returnUpdatedDocs: true },
    (err, numReplaced, doc) => {
      if (doc) callback(doc.seq);
      else callback(1);
    },
  );
}

// Convert Cart to Finalized Orders
app.post("/api/checkout", (req, res) => {
  const { userEmail, items, shipping, paymentMethod } = req.body;
  if (!userEmail || !items || !items.length) {
    return res.status(400).json({ error: "Invalid checkout payload" });
  }

  let processed = 0;
  let errors = false;

  // Process every keyboard built in the cart
  items.forEach((item) => {
    getNextOrderId((seq) => {
      const orderDoc = {
        displayId: seq, // Saved as raw integer, formatting handled on frontend
        userEmail,
        date: new Date().toLocaleDateString(),
        case: item.case,
        switch: item.switch,
        keycaps: item.keycaps,
        mods: item.mods || [],
        totalPrice: item.totalPrice,
        shipping: shipping || null,
        paymentMethod: paymentMethod,
      };

      ordersDB.insert(orderDoc, (err) => {
        if (err) errors = true;
        processed++;
        if (processed === items.length) {
          if (errors)
            return res
              .status(500)
              .json({ error: "Some items failed to process." });
          res.json({ success: true });
        }
      });
    });
  });
});

app.get("/api/orders", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email param required." });

  ordersDB.find({ userEmail: email }, (err, docs) => {
    if (err) return res.status(500).json({ error: "Could not fetch orders." });
    res.json(docs);
  });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`KeyForge server running → http://localhost:${PORT}`),
);
