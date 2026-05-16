const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const products = require("./data/products");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =========================
   DATABASE CONNECTION POOL
========================= */
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || "localhost",
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || "root",
  password:           process.env.DB_PASSWORD || "",
  database:           process.env.DB_NAME     || "keyforge",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

/* =========================
   DATABASE INIT
   Runs once on startup — creates all tables from the ERD schema
   and seeds required lookup data if not already present.
========================= */
async function initDB() {
  const conn = await pool.getConnection();
  try {

    // ── AccountTypes ──────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS AccountTypes (
        typeID          INT          AUTO_INCREMENT PRIMARY KEY,
        typeName        VARCHAR(100) NOT NULL,
        typeDescription TEXT
      )
    `);

    // ── Accounts ──────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS Accounts (
        accountID    INT          AUTO_INCREMENT PRIMARY KEY,
        email        VARCHAR(255) NOT NULL UNIQUE,
        typeID       INT          NOT NULL,
        firstName    VARCHAR(100) NOT NULL,
        lastName     VARCHAR(100) NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        CONSTRAINT fk_accounts_type FOREIGN KEY (typeID)
          REFERENCES AccountTypes (typeID)
          ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `);

    // ── PartType ──────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS PartType (
        partTypeID          INT          AUTO_INCREMENT PRIMARY KEY,
        partTypeName        VARCHAR(100) NOT NULL,
        partTypeDescription TEXT
      )
    `);

    // ── Parts ─────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS Parts (
        partID          INT            AUTO_INCREMENT PRIMARY KEY,
        partTypeID      INT            NOT NULL,
        partName        VARCHAR(255)   NOT NULL,
        imageURL        VARCHAR(500),
        partDescription TEXT,
        stockQuantity   INT            NOT NULL DEFAULT 0,
        price           DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
        CONSTRAINT fk_parts_type FOREIGN KEY (partTypeID)
          REFERENCES PartType (partTypeID)
          ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `);

    // ── Cart ──────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS Cart (
        cartID      INT       AUTO_INCREMENT PRIMARY KEY,
        accountID   INT       NOT NULL,
        dateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_cart_account FOREIGN KEY (accountID)
          REFERENCES Accounts (accountID)
          ON UPDATE CASCADE ON DELETE CASCADE
      )
    `);

    // ── Builds ────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS Builds (
        buildID     INT       AUTO_INCREMENT PRIMARY KEY,
        accountID   INT       NOT NULL,
        dateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_builds_account FOREIGN KEY (accountID)
          REFERENCES Accounts (accountID)
          ON UPDATE CASCADE ON DELETE CASCADE
      )
    `);

    // ── BuildParts ────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS BuildParts (
        buildPartsID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        buildID      INT NOT NULL,
        partID       INT NOT NULL,
        quantity     INT NOT NULL DEFAULT 1,
        CONSTRAINT fk_buildparts_build FOREIGN KEY (buildID)
          REFERENCES Builds (buildID)
          ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_buildparts_part FOREIGN KEY (partID)
          REFERENCES Parts (partID)
          ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `);

    // ── CartItems ─────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS CartItems (
        cartItemsID INT       AUTO_INCREMENT PRIMARY KEY,
        cartID      INT       NOT NULL,
        buildID     INT       NOT NULL,
        dateAdded   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cartitems_cart FOREIGN KEY (cartID)
          REFERENCES Cart (cartID)
          ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_cartitems_build FOREIGN KEY (buildID)
          REFERENCES Builds (buildID)
          ON UPDATE CASCADE ON DELETE CASCADE
      )
    `);

    // ── Orders ────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS Orders (
        orderID         INT            AUTO_INCREMENT PRIMARY KEY,
        accountID       INT            NOT NULL,
        trackingNumber  VARCHAR(100),
        deliveryAddress TEXT,
        orderPrice      DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
        orderStatus     VARCHAR(50)    NOT NULL DEFAULT 'pending',
        paymentMethod   VARCHAR(100),
        orderedAt       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,
        paidAt          TIMESTAMP      NULL,
        shippedAt       TIMESTAMP      NULL,
        CONSTRAINT fk_orders_account FOREIGN KEY (accountID)
          REFERENCES Accounts (accountID)
          ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `);

    // ── OrderItems ────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS OrderItems (
        orderItemsID    INT            AUTO_INCREMENT PRIMARY KEY,
        orderID         INT            NOT NULL,
        buildID         INT            NOT NULL,
        dateAdded       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        unitPriceAtSale DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
        CONSTRAINT fk_orderitems_order FOREIGN KEY (orderID)
          REFERENCES Orders (orderID)
          ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_orderitems_build FOREIGN KEY (buildID)
          REFERENCES Builds (buildID)
          ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `);

    // ── Seed: AccountTypes ────────────────────────────────────
    await conn.execute(`
      INSERT IGNORE INTO AccountTypes (typeID, typeName, typeDescription) VALUES
        (1, 'customer', 'Standard customer account'),
        (2, 'admin',    'Administrator with full access')
    `);

    // ── Seed: PartType ────────────────────────────────────────
    await conn.execute(`
      INSERT IGNORE INTO PartType (partTypeID, partTypeName, partTypeDescription) VALUES
        (1, 'case',    'Keyboard case / kit'),
        (2, 'switch',  'Keyboard switches'),
        (3, 'keycaps', 'Keycap sets'),
        (4, 'mods',    'Modifications and accessories')
    `);

    console.log("✓ Database schema ready.");
  } finally {
    conn.release();
  }
}

/* =========================
   PRODUCTS (catalog — served from flat file)
========================= */
app.get("/api/products", (req, res) => {
  if (!products)
    return res.status(500).json({ error: "Product catalog missing on server." });
  res.json(products);
});

/* =========================
   USERS / ACCOUNTS
========================= */

// REGISTER
app.post("/api/users/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  if (!email || !firstName || !lastName || !password)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const [existing] = await pool.execute(
      "SELECT accountID FROM Accounts WHERE email = ?",
      [email]
    );
    if (existing.length > 0)
      return res.status(409).json({ error: "Email already in use." });

    const [result] = await pool.execute(
      `INSERT INTO Accounts (email, firstName, lastName, passwordHash, typeID)
       VALUES (?, ?, ?, ?, 1)`,
      [email, firstName, lastName, password]
    );

    res.json({ accountID: result.insertId, email, firstName, lastName, typeID: 1 });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed." });
  }
});

// LOGIN
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required." });

  try {
    const [rows] = await pool.execute(
      `SELECT accountID, email, firstName, lastName, typeID
       FROM Accounts WHERE email = ? AND passwordHash = ?`,
      [email, password]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials." });

    res.json(rows[0]);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error." });
  }
});

// UPDATE PROFILE
app.put("/api/users/update", async (req, res) => {
  const { email, firstName, lastName } = req.body;
  if (!email || !firstName || !lastName)
    return res.status(400).json({ error: "All fields required." });

  try {
    const [result] = await pool.execute(
      "UPDATE Accounts SET firstName = ?, lastName = ? WHERE email = ?",
      [firstName, lastName, email]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found." });

    res.json({ ok: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed." });
  }
});

/* =========================
   CHECKOUT
   Flow: resolve account → create Order → for each cart item:
         create Build + BuildParts + OrderItem (price snapshot)
========================= */
app.post("/api/checkout", async (req, res) => {
  const { userEmail, items, shipping, paymentMethod } = req.body;
  if (!userEmail || !items || !items.length)
    return res.status(400).json({ error: "Invalid checkout payload." });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Resolve accountID from email
    const [accountRows] = await conn.execute(
      "SELECT accountID FROM Accounts WHERE email = ?",
      [userEmail]
    );
    if (accountRows.length === 0) throw new Error("Account not found.");
    const accountID = accountRows[0].accountID;

    // Calculate grand total
    const orderPrice = items.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );

    // Build delivery address string from shipping object
    const deliveryAddress = shipping
      ? `${shipping.address}, ${shipping.city}, ${shipping.postal}`
      : null;

    // Create the Order record
    const [orderResult] = await conn.execute(
      `INSERT INTO Orders
         (accountID, deliveryAddress, orderPrice, orderStatus, paymentMethod, paidAt)
       VALUES (?, ?, ?, 'confirmed', ?, NOW())`,
      [accountID, deliveryAddress, orderPrice, paymentMethod || "Card"]
    );
    const orderID = orderResult.insertId;

    // Persist each build from the cart
    for (const item of items) {
      // Create a Builds record
      const [buildResult] = await conn.execute(
        "INSERT INTO Builds (accountID) VALUES (?)",
        [accountID]
      );
      const buildID = buildResult.insertId;

      // Flatten all parts (case, switch, keycaps + any mods) and insert into BuildParts
      const parts = [
        item.case,
        item.switch,
        item.keycaps,
        ...(item.mods || []),
      ].filter((p) => p && p.id);

      for (const part of parts) {
        await conn.execute(
          "INSERT INTO BuildParts (buildID, partID, quantity) VALUES (?, ?, 1)",
          [buildID, part.id]
        );
      }

      // Create the OrderItem — snapshot the price at time of sale
      await conn.execute(
        `INSERT INTO OrderItems (orderID, buildID, unitPriceAtSale)
         VALUES (?, ?, ?)`,
        [orderID, buildID, Number(item.totalPrice) || 0]
      );
    }

    await conn.commit();
    res.json({ success: true, orderID });
  } catch (err) {
    await conn.rollback();
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to process order checkout." });
  } finally {
    conn.release();
  }
});

/* =========================
   ORDERS — fetch order history for a user
========================= */
app.get("/api/orders", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email param required." });

  try {
    // 1. Fetch all orders belonging to this account
    const [orders] = await pool.execute(
      `SELECT
         o.orderID         AS displayId,
         o.orderPrice      AS totalPrice,
         o.orderStatus,
         o.deliveryAddress AS shippingAddress,
         o.orderedAt       AS date,
         o.paymentMethod
       FROM Orders o
       JOIN Accounts a ON a.accountID = o.accountID
       WHERE a.email = ?
       ORDER BY o.orderedAt ASC`,
      [email]
    );

    if (orders.length === 0) return res.json([]);

    // 2. Fetch all builds + their parts for those orders in a single query
    const orderIDs     = orders.map((o) => o.displayId);
    const placeholders = orderIDs.map(() => "?").join(",");

    const [rows] = await pool.execute(
      `SELECT
         oi.orderID,
         oi.buildID,
         oi.unitPriceAtSale  AS buildPrice,
         p.partName,
         p.price             AS partPrice,
         pt.partTypeName     AS category
       FROM OrderItems oi
       JOIN BuildParts bp ON bp.buildID    = oi.buildID
       JOIN Parts p       ON p.partID      = bp.partID
       JOIN PartType pt   ON pt.partTypeID = p.partTypeID
       WHERE oi.orderID IN (${placeholders})`,
      orderIDs
    );

    // 3. Group parts back into structured build objects per order
    const buildsByOrder = {};
    for (const row of rows) {
      if (!buildsByOrder[row.orderID])
        buildsByOrder[row.orderID] = {};

      const builds = buildsByOrder[row.orderID];
      if (!builds[row.buildID]) {
        builds[row.buildID] = {
          buildID:    row.buildID,
          totalPrice: Number(row.buildPrice),
          case:       null,
          switch:     null,
          keycaps:    null,
          mods:       [],
        };
      }

      const part = { name: row.partName, price: Number(row.partPrice) };
      const cat  = row.category;

      if      (cat === "case")    builds[row.buildID].case    = part;
      else if (cat === "switch")  builds[row.buildID].switch  = part;
      else if (cat === "keycaps") builds[row.buildID].keycaps = part;
      else if (cat === "mods")    builds[row.buildID].mods.push(part);
    }

    // 4. Attach assembled items array to each order and return
    const result = orders.map((o) => ({
      ...o,
      items: Object.values(buildsByOrder[o.displayId] || {}),
    }));

    res.json(result);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Could not fetch orders." });
  }
});

/* =========================
   START SERVER
   initDB() runs first — tables are guaranteed to exist
   before the server accepts any requests.
========================= */
const PORT = process.env.PORT || 3000;
initDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`KeyForge server running → http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to initialize database schema:", err);
    process.exit(1);
  });