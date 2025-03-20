const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Vyasvraj@92',
  database: 'HospitalDB',
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Serve HTML on root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Insert Doctor
app.post('/addDoctor', (req, res) => {
  const { DoctorName, Department, Category } = req.body;
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
