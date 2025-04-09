const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');

app.use(cors());
app.use(express.json());

function authenticateEmail(req, res, next) {
  const email = req.headers['x-user-email'];
  if (!email) return res.status(401).json({ error: 'Missing email header' });

  const users = loadUsers();
  const userExists = users.some(u => u.email === email);
  if (!userExists) return res.status(403).json({ error: 'Invalid user' });

  req.user = email;
  next();
}


function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const { hash } = hashPassword(password, user.salt);
  if (hash === user.hash) {
    return res.json({ success: true, email, userName: user.userName });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.post('/api/signup', (req, res) => {
  const { email, password, userName } = req.body;
  const users = loadUsers();

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const { hash, salt } = hashPassword(password);
  users.push({ email, hash, salt, userName });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.status(201).json({ success: true, email, userName });
});

app.get('/api/questions', authenticateEmail, (req, res) => {
  const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
  const noAnswers = questions.map(({ answer, ...q }) => q);
  res.json(noAnswers);
});

app.post('/api/submit', authenticateEmail, (req, res) => {
  const submittedAnswers = req.body.answers;
  const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
  let score = 0;

  questions.forEach(q => {
    if (submittedAnswers[q.id] === q.answer) score++;
  });

  res.json({ score, total: questions.length });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));