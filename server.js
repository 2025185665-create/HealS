// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname)));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------- MySQL Connection ----------
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'heals_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
  } else {
    console.log('✅ Connected to MySQL database heals_db');
  }
});

// ---------- OpenAI Configuration ----------
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ---------- Routes ----------

// Test route
app.get('/', (req, res) => {
  res.send('HealS Server is running 🚀');
});

// --- LOGIN ---
// --- CREATE ADMIN (manual / secure) ---
app.post('/create-admin', (req, res) => {
  const { userID, fullName, email, password } = req.body;

  db.query(
    'INSERT INTO users (userID, fullName, email, password, role) VALUES (?, ?, ?, ?, "admin")',
    [userID, fullName, email, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: 'Admin created successfully' });
    }
  );
});

app.post('/login', (req, res) => {
  const { role, userID, password } = req.body;

  if (role === 'admin') {
    // Admin login using userID instead of email (minimal fix)
    db.query(
      'SELECT * FROM users WHERE role = "admin" AND userID = ? AND password = ?',
      [userID, password],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) res.json({ success: true, user: results[0] });
        else res.json({ success: false, message: 'Invalid admin credentials' });
      }
    );
  } else {
    db.query(
      'SELECT * FROM users WHERE role = ? AND userID = ? AND password = ?',
      [role, userID, password],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) res.json({ success: true, user: results[0] });
        else res.json({ success: false, message: 'Invalid credentials' });
      }
    );
  }
});


// --- REGISTER ---
app.post('/register', (req, res) => {
  const { role, userID, fullName, email, password } = req.body;

  // Only student and counselor can register
  if (!['student', 'counselor'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role for registration' });
  }

  db.query(
    'INSERT INTO users (userID, fullName, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [userID, fullName, email, password, role],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: `${role} registered successfully` });
    }
  );
});

// --- GET STUDENT MOODS ---
app.get('/moods/:studentID', (req, res) => {
  const { studentID } = req.params;
  db.query(
    'SELECT * FROM moods WHERE studentID = ? ORDER BY created_at DESC',
    [studentID],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// --- COUNSELOR: GET ALL MOOD RECORDS FOR A STUDENT ---
app.get('/counselor/mood/:studentID', (req, res) => {
  const { studentID } = req.params;
  db.query(
    'SELECT created_at AS date, mood, message AS notes FROM moods WHERE studentID = ? ORDER BY created_at DESC',
    [studentID],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// --- COUNSELOR: GET ALL STUDENTS WITH MOOD RECORDS ---
app.get('/counselor/mood', (req, res) => {
  const query = `
    SELECT DISTINCT u.userID, u.fullName
    FROM users u
    JOIN moods m ON u.userID = m.studentID
    WHERE u.role = 'student'
    ORDER BY u.fullName
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Failed to fetch students with moods:", err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});



// --- RECORD MOOD (Student) ---
app.post('/moods', (req, res) => {
  const { studentID, mood, message } = req.body;
  db.query(
    'INSERT INTO moods (studentID, mood, message) VALUES (?, ?, ?)',
    [studentID, mood, message],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: 'Mood recorded successfully' });
    }
  );
});

// --- GET USER INFO (used by counselor pages) ---
app.get('/users/:userID', (req, res) => {
  const { userID } = req.params;
  db.query('SELECT userID, fullName, role FROM users WHERE userID = ?', [userID], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});


// --- BMI RECORDS ---
app.post('/bmi', (req, res) => {
  const { studentID, value, status, weight, height } = req.body;

  db.query(
    'INSERT INTO bmi_records (studentID, value, status, weight, height) VALUES (?, ?, ?, ?, ?)',
    [studentID, value, status, weight, height],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: 'BMI recorded successfully' });
    }
  );
});

app.get('/bmi/:studentID', (req, res) => {
  const { studentID } = req.params;
  db.query(
    'SELECT * FROM bmi_records WHERE studentID = ? ORDER BY created_at DESC',
    [studentID],
    (err, results) => err ? res.status(500).json({ error: err }) : res.json(results)
  );
});


// --- COUNSELOR: ALL STUDENTS BMI (latest) ---
app.get('/counselor/bmi', (req, res) => {
  const query = `
    SELECT u.userID, u.fullName, b.value AS bmi, b.status
    FROM users u
    LEFT JOIN (
      SELECT br1.studentID, br1.value, br1.status
      FROM bmi_records br1
      JOIN (
        SELECT studentID, MAX(created_at) AS max_date
        FROM bmi_records
        GROUP BY studentID
      ) br2 ON br1.studentID = br2.studentID AND br1.created_at = br2.max_date
    ) b ON u.userID = b.studentID
    WHERE u.role = 'student'
    ORDER BY u.fullName
  `;
  db.query(query, (err, results) => err ? res.status(500).json({ error: err }) : res.json(results));
});


// --- GET TIMETABLE ---
app.get('/timetable/:studentID', (req, res) => {
  const { studentID } = req.params;
  db.query(
    'SELECT * FROM timetable WHERE studentID = ?',
    [studentID],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// --- ADD TIMETABLE ENTRY ---
app.post('/timetable', (req, res) => {
  const { studentID, day, subject, time } = req.body;
  db.query(
    'INSERT INTO timetable (studentID, day, subject, time) VALUES (?, ?, ?, ?)',
    [studentID, day, subject, time],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: 'Timetable entry added' });
    }
  );
});

// --- DELETE TIMETABLE ENTRY ---
app.delete('/timetable/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM timetable WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: 'Timetable entry deleted' });
  });
});

// --- RESET TIMETABLE FOR STUDENT ---
app.delete('/timetable/reset/:studentID', (req, res) => {
  const { studentID } = req.params;
  db.query('DELETE FROM timetable WHERE studentID = ?', [studentID], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: 'Timetable reset successfully' });
  });
});

// --- SEND FEEDBACK (Counselor) ---
app.post('/counselor/feedback', (req, res) => {
  const { studentID, counselorID, text } = req.body;

  db.query(
    'INSERT INTO feedback (studentID, counselorID, text) VALUES (?, ?, ?)',
    [studentID, counselorID, text],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: 'Feedback sent successfully' });
    }
  );
});


// --- GET FEEDBACK FOR STUDENT ---
app.get('/feedback/:studentID', (req, res) => {
  const { studentID } = req.params;
  db.query(
    'SELECT * FROM feedback WHERE studentID = ? ORDER BY date DESC',
    [studentID],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// --- OPENAI WELLNESS TIP ---
app.post('/wellness-tip', async (req, res) => {
  const { mood, bmiStatus, timetableSummary } = req.body;

  try {
   const prompt = `
You are a student wellness advisor.

Use ALL the information below to generate ONE personalized wellness tip.
The tip MUST reflect the student's latest records.

Student context:
- Mood: ${mood}
- BMI Status: ${bmiStatus}
- Timetable: ${timetableSummary}

Rules:
1. Always respond to the student's mood first.
2. If BMI is not "Normal", gently include a related healthy habit (exercise, rest, or nutrition).
3. Make the advice suitable for the student's timetable (short if busy).
4. Keep it positive, safe, and non-medical.
5. ONE short paragraph only.

Wellness Tip:
`;


    const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 100
});

const tip = response.choices[0].message.content.trim();
    res.json({ tip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate wellness tip' });
  }
});
// --- Admin: Get all users ---
app.get('/admin/users', (req, res) => {
  db.query('SELECT userID, fullName, email, role FROM users WHERE role != "admin"', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err });
    res.json(results);
  });
});

// --- Admin: Add new user ---
app.post('/admin/users', (req, res) => {
  const { fullName, userID, email, password, role } = req.body;
  db.query(
    'INSERT INTO users (userID, fullName, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [userID, fullName, email, password, role],
    (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") return res.json({ success: false, message: "User ID already exists." });
        return res.status(500).json({ success: false, message: err });
      }
      res.json({ success: true });
    }
  );
});

// --- Admin: Delete user and their records ---
app.delete('/admin/users/:userID', (req, res) => {
  const { userID } = req.params;

  // Delete all related records first
  const queries = [
    'DELETE FROM moods WHERE studentID = ?',
    'DELETE FROM bmi_records WHERE studentID = ?',
    'DELETE FROM timetable WHERE studentID = ?',
    'DELETE FROM feedback WHERE studentID = ?',
    'DELETE FROM users WHERE userID = ?'
  ];

  queries.reduce((prev, query) => {
    return prev.then(() => new Promise((resolve, reject) => {
      db.query(query, [userID], (err, results) => err ? reject(err) : resolve(results));
    }));
  }, Promise.resolve())
  .then(() => res.json({ success: true }))
  .catch(err => {
    console.error(err);
    res.status(500).json({ success: false, message: err });
  });
});


// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 HealS server running on port ${PORT}`);
});
