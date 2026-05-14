const express = require('express');
const path = require('path');
const Datastore = require('@seald-io/nedb'); // Use the maintained version
const products = require("../data/products");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Initialize Databases
const usersDB  = new Datastore({ filename: 'users.db',  autoload: true });
const ordersDB = new Datastore({ filename: 'orders.db', autoload: true });

/* =========================
   PRODUCTS (catalog)
========================= */
app.get("/api/products", (req, res) => {
    if (!products) {
        return res.status(500).json({ error: "Product catalog missing on server." });
    }
    res.json(products);
});

/* =========================
   USERS
========================= */
// Register
app.post('/api/users/register', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    usersDB.findOne({ email }, (err, existing) => {
        if (existing) return res.status(409).json({ error: 'Email already in use.' });
        
        usersDB.insert(req.body, (err, doc) => {
            if (err) return res.status(500).json({ error: 'Registration failed.' });
            const { password, ...safeUser } = doc;
            res.json(safeUser);
        });
    });
});

// Login
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    usersDB.findOne({ email, password }, (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        
        const { password: _pw, ...safeUser } = user;
        res.json(safeUser);
    });
});

// Update profile
app.put('/api/users/update', (req, res) => {
    const { email, firstName, lastName } = req.body;
    usersDB.update({ email }, { $set: { firstName, lastName } }, {}, (err, n) => {
        if (err || n === 0) return res.status(500).json({ error: 'Update failed.' });
        res.json({ ok: true });
    });
});

/* =========================
   ORDERS (saved builds)
========================= */
// Save order
app.post('/api/orders', (req, res) => {
    ordersDB.insert(req.body, (err, doc) => {
        if (err) return res.status(500).json({ error: 'Could not save order.' });
        res.json(doc);
    });
});

// Get orders for a user
app.get('/api/orders', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email param required.' });
    
    ordersDB.find({ userEmail: email }, (err, docs) => {
        if (err) return res.status(500).json({ error: 'Could not fetch orders.' });
        res.json(docs);
    });
});

/* =========================
   SERVER START
========================= */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`KeyForge server running → http://localhost:${PORT}`);
});