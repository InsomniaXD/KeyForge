const express = require('express');
const path = require('path');
const Datastore = require('@seald-io/nedb');
const app = express();

 
app.use(express.json());
app.use(express.static(__dirname));

 
const usersDB  = new Datastore({ filename: 'users.db',  autoload: true });
const ordersDB = new Datastore({ filename: 'orders.db', autoload: true });
 
// Register
app.post('/api/users/register', (req, res) => {
    const { email } = req.body;
    usersDB.findOne({ email }, (err, existing) => {
        if (existing) return res.status(409).json({ error: 'Email already in use.' });
        usersDB.insert(req.body, (err, doc) => {
            if (err) return res.status(500).json({ error: 'Registration failed.' });
            const { password, ...safe } = doc;
            res.json(safe);
        });
    });
});
 
// Login
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    usersDB.findOne({ email, password }, (err, user) => {
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        const { password: _pw, ...safe } = user;
        res.json(safe);
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
 
app.listen(3000, () => console.log('KeyForge server running → http://localhost:3000'));