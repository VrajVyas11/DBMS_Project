const express = require('express');
//const mysql = require('mysql');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// =================================================
//
//                    For Dev
//
//  =================================================
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Vyasvraj@92',
//   database: 'HospitalDB',
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('MySQL Connected...');
// });

// =============================================================
// 
//              Production 
// 
// =============================================================


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: process.env.SSL_CERT_PATH
  },
  multipleStatements: true
});

db.connect(async (err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL Connected to Aiven...');

  try {
    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'HMSDB_Production.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await executeSQL(schemaSQL, 'Database schema created successfully');
    
    // Read and execute data file
    const dataPath = path.join(__dirname, 'dataentryes.sql');
    const dataSQL = fs.readFileSync(dataPath, 'utf8');
    await executeSQL(dataSQL, 'Sample data inserted successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
  }
});

// Helper function to execute SQL queries
function executeSQL(sql, successMessage) {
  return new Promise((resolve, reject) => {
    // Split SQL file into individual queries
    const queries = sql.split(';').filter(q => q.trim() !== '');
    
    // Execute queries sequentially
    const executeNext = (index) => {
      if (index >= queries.length) {
        console.log(successMessage);
        return resolve();
      }

      db.query(queries[index], (err, results) => {
        if (err) return reject(err);
        executeNext(index + 1);
      });
    };

    executeNext(0);
  });
}




// Serve HTML on root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Insert Doctor
app.post('/addDoctor', (req, res) => {
  const { DoctorName, Department, Category } = req.body;
  console.log(req.body)

  const sql = 'INSERT INTO Doctor (DoctorName, Department, Category) VALUES (?, ?, ?)';
  db.query(sql, [DoctorName, Department, Category], (err, result) => {
    if (err) throw err;
    res.send('Doctor added successfully');
  });
});

// Get All Doctors
app.get('/getDoctors', (req, res) => {
  const sql = 'SELECT * FROM Doctor';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get Permanent Doctors
app.get('/getPermanentDoctors', (req, res) => {
  const sql = 'SELECT * FROM Permanent_Doctor';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get Visiting Doctors
app.get('/getVisitingDoctors', (req, res) => {
  const sql = 'SELECT * FROM Visiting_Doctor';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get Trainee Doctors
app.get('/getTraineeDoctors', (req, res) => {
  const sql = 'SELECT * FROM Trainee_Doctor';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Delete Doctor
app.delete('/deleteDoctor/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Doctor WHERE DoctorID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Doctor deleted successfully');
  });
});

// Add Patient
app.post('/addPatient', (req, res) => {
  const { PatientName, Age, Address, Disease, Gender } = req.body;
  const sql = 'INSERT INTO Patient (Name, Age, Address, Disease, Gender) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [PatientName, Age, Address, Disease, Gender], (err, result) => {
    if (err) throw err;
    res.send('Patient added successfully');
  });
});

// Get all Patients
app.get('/getPatients', (req, res) => {
  const sql = 'SELECT * FROM Patient';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get all Inpatients
app.get('/getInpatients', (req, res) => {
  const sql = 'SELECT * FROM Inpatient INNER JOIN Patient ON Inpatient.PatientID = Patient.PatientID';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get all Outpatients
app.get('/getOutpatients', (req, res) => {
  const sql = 'SELECT * FROM Outpatient INNER JOIN Patient ON Outpatient.PatientID = Patient.PatientID';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get all Rooms
app.get('/getRooms', (req, res) => {
  const sql = 'SELECT * FROM Room';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Discharge Inpatient and Update Room Status
app.put('/dischargePatient/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'UPDATE Inpatient SET Status = "Discharged" WHERE PatientID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Patient discharged and room status updated');
  });
});

// Generate Bill
app.post('/addBill', (req, res) => {
  const { PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges } = req.body;
  const sql = 'INSERT INTO Bill (PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges], (err, result) => {
    if (err) throw err;
    res.send('Bill generated successfully');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  //console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Server running on the PORT:${PORT}`);
});
