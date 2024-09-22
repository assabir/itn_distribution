const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const itnRoutes = require('./routes/itn');


const app = express();
const db = new sqlite3.Database('./database/database.sqlite');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session management
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));

// Initialize Database and Create Tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS itn_distribution (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_id TEXT,
      household_head_name TEXT,
      family_members INTEGER,
      itns_distributed INTEGER,
      distribution_date TEXT
    )
  `);

  // Create a default user (admin/password123)
  const hashedPassword = bcrypt.hashSync('2580@Dibal', 10);
  db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, ['amdibal@rocketmail.com', hashedPassword]);
});

// Routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).send('Error querying database.');
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    req.session.userId = user.id;
    res.redirect('/');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// ITN routes
app.use('/', itnRoutes);

// Start Server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
