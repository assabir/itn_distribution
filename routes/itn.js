const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./database/database.sqlite');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// ITN Distribution Page (HTML Form)
router.get('/', isAuthenticated, (req, res) => {
  res.render('index');
});

// API - POST ITN Distribution Data
router.post('/api/distribution', isAuthenticated, (req, res) => {
  const { household_id, household_head_name, family_members, itns_distributed, distribution_date } = req.body;

  // Validate required fields
  if (!household_id || !household_head_name || !family_members || !itns_distributed || !distribution_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert ITN distribution data into the database
  const sql = `
    INSERT INTO itn_distribution (household_id, household_head_name, family_members, itns_distributed, distribution_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [household_id, household_head_name, family_members, itns_distributed, distribution_date], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to submit data' });
    }
    res.status(201).json({ message: 'ITN Distribution data submitted successfully', id: this.lastID });
  });
});

// API - GET All ITN Distribution Data
router.get('/api/distribution', isAuthenticated, (req, res) => {
  const sql = `SELECT * FROM itn_distribution`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});


router.get('/records', (req, res) => {
  db.all('SELECT * FROM itn_distribution', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Failed to retrieve records.');
    }
    res.render('records', { records: rows }); // Pass records to the view
  });
})


module.exports = router;
