const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

// ─── If you have a products data file, keep this require ───
// const products = require("./data/products");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   DATABASE CONNECTION POOL
   Set these in phpMyAdmin / your MySQL server.
   Either use environment variables (recommended) or hard-code for local dev.
========================= */
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "keyforge",
  waitForConnections: true,
  connectionLimit: 10,
});

/* =========================
   DATABASE SETUP
   Run once on server start to create tables if they don't exist.
   You can also run these SQL statements directly in phpMyAdmin.
========================= */
async function initDB() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        firstName   VARCHAR(100)  NOT NULL,
        lastName    VARCHAR(100)  NOT NULL,
        email       VARCHAR(255)  NOT NULL UNIQUE,
        password    VARCHAR(255)  NOT NULL,
        createdAt   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        userEmail     VARCHAR(255) NOT NULL,
        items         JSON         NOT NULL,
        totalPrice    DECIMAL(10,2) NOT NULL,
        shipping      JSON,
        paymentMethod VARCHAR(50),
        orderDate     DATE,
        createdAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅  Database tables ready.");
  } finally {
    conn.release();
  }
}

/* =========================
   PRODUCTS (catalog)
   Uncomment if you have a local products file,
   or replace with a DB query if products live in MySQL.
========================= */
// app.get("/api/products", (req, res) => {
//   if (!products) return res.status(500).json({ error: "Product catalog missing." });
//   res.json(products);
// });

/* =========================
   USERS – REGISTER
========================= */
app.post("/api/users/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already in use." });
    }

    const [result] = await pool.query(
      "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, password]
    );

    res.json({ id: result.insertId, firstName, lastName, email });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed." });
  }
});

/* =========================
   USERS – LOGIN
========================= */
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, firstName, lastName, email FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.json(rows[0]); // never returns password column
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error." });
  }
});

/* =========================
   USERS – UPDATE PROFILE
========================= */
app.put("/api/users/update", async (req, res) => {
  const { email, firstName, lastName } = req.body;
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: "All fields required." });
  }

  try {
    const [result] = await pool.query(
      "UPDATE users SET firstName = ?, lastName = ? WHERE email = ?",
      [firstName, lastName, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed." });
  }
});

/* =========================
   ORDERS – CHECKOUT
========================= */
app.post("/api/checkout", async (req, res) => {
  const { userEmail, items, shipping, paymentMethod } = req.body;
  if (!userEmail || !items || !items.length) {
    return res.status(400).json({ error: "Invalid checkout payload." });
  }

  const combinedTotal = items.reduce(
    (sum, item) => sum + (Number(item.totalPrice) || 0),
    0
  );

  try {
    await pool.query(
      `INSERT INTO orders (userEmail, items, totalPrice, shipping, paymentMethod, orderDate)
       VALUES (?, ?, ?, ?, ?, CURDATE())`,
      [
        userEmail,
        JSON.stringify(items),
        combinedTotal,
        shipping ? JSON.stringify(shipping) : null,
        paymentMethod || null,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to process order." });
  }
});

/* =========================
   ORDERS – FETCH BY USER
========================= */
app.get("/api/orders", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email param required." });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM orders WHERE userEmail = ? ORDER BY createdAt DESC",
      [email]
    );

    // Parse JSON columns back to objects (MySQL returns them as strings)
    const parsed = rows.map((o) => ({
      ...o,
      displayId: o.id,
      date: o.orderDate
        ? new Date(o.orderDate).toLocaleDateString()
        : new Date(o.createdAt).toLocaleDateString(),
      items:    typeof o.items    === "string" ? JSON.parse(o.items)    : o.items,
      shipping: typeof o.shipping === "string" ? JSON.parse(o.shipping) : o.shipping,
    }));

    res.json(parsed);
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ error: "Could not fetch orders." });
  }
});

/* =========================
   START
========================= */
const PORT = process.env.PORT || 3000;

initDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`KeyForge server running → http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌  Could not connect to database:", err.message);
    process.exit(1);
  });