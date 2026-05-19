const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

// Safely pull from data/products.js out of the public folder
let productsList = [];
try {
  productsList = require(path.join(__dirname, "..", "data", "products"));
} catch (e) {
  try {
    // Alternative fallback path
    productsList = require(path.join(__dirname, "data", "products"));
  } catch (err) {
    console.error("⚠️ Could not load data/products.js file automatically. Check your paths!");
  }
}

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   DATABASE CONNECTION POOL
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
========================= */
async function initDB() {
  const conn = await pool.getConnection();
  try {
    // 1. Users Table
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

    // 2. Orders Table
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

    // 3. Products Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        category    VARCHAR(50)   NOT NULL,
        name        VARCHAR(255)  NOT NULL,
        price       DECIMAL(10,2) NOT NULL,
        \`desc\`    TEXT,
        img         TEXT
      )
    `);

    console.log("✅ Database tables ready.");
  } finally {
    conn.release();
  }
}

/* =========================
   DATABASE SEEDING ROUTINE
========================= */
async function seedProducts() {
  if (!Array.isArray(productsList) || productsList.length === 0) {
    console.log("⚠️ No local products array available to seed.");
    return;
  }
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM products");
    if (rows[0].count === 0) {
      console.log("🌱 Seeding products into database...");
      for (const prod of productsList) {
        await pool.query(
          "INSERT INTO products (id, category, name, price, `desc`, img) VALUES (?, ?, ?, ?, ?, ?)",
          [prod.id, prod.category, prod.name, prod.price, prod.desc, prod.img]
        );
      }
      console.log("✅ Database successfully seeded with products!");
    }
  } catch (err) {
    console.error("❌ Error seeding products:", err);
  }
}

/* =========================
   PRODUCTS (catalog) - NOW LIVE FROM DB
========================= */
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    
    // FIX: Parse the MySQL DECIMAL string back into a JavaScript Number
    // so builder.js doesn't crash when calling .toFixed(2)
    const parsedRows = rows.map((row) => ({
      ...row,
      price: parseFloat(row.price), 
    }));
    
    res.json(parsedRows);
  } catch (err) {
    console.error("Error fetching products from DB:", err);
    res.status(500).json({ error: "Could not retrieve product catalog." });
  }
});

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

    res.json(rows[0]);
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
   ORDERS – SAVE BUILD (Added Missing Route)
========================= */
app.post("/api/orders", async (req, res) => {
  const { userEmail, case: kfCase, switch: kfSwitch, keycaps, mods, totalPrice } = req.body;
  if (!userEmail) {
    return res.status(400).json({ error: "User email required." });
  }

  try {
    const itemsPayload = { case: kfCase, switch: kfSwitch, keycaps, mods };
    await pool.query(
      `INSERT INTO orders (userEmail, items, totalPrice, orderDate)
       VALUES (?, ?, ?, CURDATE())`,
      [userEmail, JSON.stringify(itemsPayload), totalPrice || 0]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving build order:", err);
    res.status(500).json({ error: "Failed to save order to database." });
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
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

initDB()
  .then(() => seedProducts()) // Automatically seeds MySQL if products table is empty
  .then(() => {
    app.use((req, res, next) => {
      res.status(404).sendFile(path.join(__dirname, "index.html"));
    });
    app.listen(PORT, () =>
      console.log(`KeyForge server running → http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Could not connect to database:", err.message);
    process.exit(1);
  });