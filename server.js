const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(async err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
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
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding doctor');
    }
    res.send('Doctor added successfully');
  });
});

// Get All Doctors
app.get('/getDoctors', (req, res) => {
  const sql = 'SELECT * FROM Doctor';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching doctors');
    }
    res.json(results);
  });
});

// Get Permanent Doctors
app.get('/getPermanentDoctors', (req, res) => {
  const sql = 'SELECT * FROM Permanent_Doctor';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching permanent doctors');
    }
    res.json(results);
  });
});

// Get Visiting Doctors
app.get('/getVisitingDoctors', (req, res) => {
  const sql = 'SELECT * FROM Visiting_Doctor';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching visiting doctors');
    }
    res.json(results);
  });
});

// Get Trainee Doctors
app.get('/getTraineeDoctors', (req, res) => {
  const sql = 'SELECT * FROM Trainee_Doctor';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching trainee doctors');
    }
    res.json(results);
  });
});

// Delete Doctor
app.delete('/deleteDoctor/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Doctor WHERE DoctorID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting doctor');
    }
    res.send('Doctor deleted successfully');
  });
});


// Delete Patient
app.delete('/deletePatient/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Patient WHERE PatientID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting doctor');
    }
    res.send('Patient deleted successfully');
  });
});

// Add Patient
app.post('/addPatient', (req, res) => {
  const { FirstName, LastName, Age, Address, Disease, Gender, PatientCondition } = req.body;
  const sql = 'INSERT INTO Patient (FirstName, LastName, Age, Address, Disease, Gender, PatientCondition) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [FirstName, LastName, Age, Address, Disease, Gender, PatientCondition], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding patient');
    }
    res.send('Patient added successfully');
  });
});

// Get all Patients
app.get('/getPatients', (req, res) => {
  const sql = 'SELECT * FROM Patient';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching patients');
    }
    res.json(results);
  });
});

// Get all Inpatients
app.get('/getInpatients', (req, res) => {
  const sql = 'SELECT * FROM Inpatient INNER JOIN Patient ON Inpatient.PatientID = Patient.PatientID';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching inpatients');
    }
    res.json(results);
  });
});

// Get all Outpatients
app.get('/getOutpatients', (req, res) => {
  const sql = 'SELECT * FROM Outpatient INNER JOIN Patient ON Outpatient.PatientID = Patient.PatientID';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching outpatients');
    }
    res.json(results);
  });
});

// Get all Rooms
app.get('/getRooms', (req, res) => {
  const sql = 'SELECT * FROM Room';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching rooms');
    }
    res.json(results);
  });
});

// Discharge Inpatient and Update Room Status
app.put('/dischargePatient/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'UPDATE Inpatient SET Status = "Discharged" WHERE PatientID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error discharging patient');
    }
    res.send('Patient discharged and room status updated');
  });
});

// Generate Bill
app.post('/addBill', (req, res) => {
  const { PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges } = req.body;
  const sql = 'INSERT INTO Bill (PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error generating bill');
    }
    res.send('Bill generated successfully');
  });
});

// Calculate Total Bill for a Patient
app.get('/calculateTotalBill/:patientId', (req, res) => {
  const { patientId } = req.params;
  if (isNaN(patientId)) {
    return res.status(400).send('Invalid patient ID');
  }
  const sql = 'SELECT CalculateTotalBill(?) AS TotalBill';
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error calculating total bill');
    }
    res.json(results[0]);
  });
});

// Check if a Room is Available
app.get('/isRoomAvailable/:roomType', (req, res) => {
  const { roomType } = req.params;
  const sql = 'SELECT IsRoomAvailable(?) AS IsAvailable';
  db.query(sql, [roomType], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error checking room availability');
    }
    res.json(results[0]);
  });
});

// Admit a Patient as Inpatient
app.post('/admitPatient', (req, res) => {
  const { patientId, roomType, advanceAmount } = req.body;
  const sql = 'CALL AdmitPatient(?, ?, ?)';
  db.query(sql, [patientId, roomType, advanceAmount], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error admitting patient');
    }
    res.send('Patient admitted successfully');
  });
});

// Discharge a Patient
app.put('/dischargePatient/:patientId', (req, res) => {
  const { patientId } = req.params;
  const { dischargeDate } = req.body;
  const sql = 'CALL DischargePatient(?, ?)';
  db.query(sql, [patientId, dischargeDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error discharging patient');
    }
    res.send('Patient discharged successfully');
  });
});

// Update Patient Info
app.put('/updatePatientInfo', (req, res) => {
  const { patientId, firstName, lastName, address, age, gender, disease, condition } = req.body;

  // Build the SQL update query dynamically based on provided fields
  let sql = 'UPDATE Patient SET ';
  const updates = [];
  const params = [];

  if (firstName) {
      updates.push('FirstName = ?');
      params.push(firstName);
  }
  if (lastName) {
      updates.push('LastName = ?');
      params.push(lastName);
  }
  if (address) {
      updates.push('Address = ?');
      params.push(address);
  }
  if (age) {
      updates.push('Age = ?');
      params.push(age);
  }
  if (gender) {
      updates.push('Gender = ?');
      params.push(gender);
  }
  if (disease) {
      updates.push('Disease = ?');
      params.push(disease);
  }
  if (condition) {
      updates.push('PatientCondition = ?');
      params.push(condition);
  }

  // Ensure that at least one field is provided for update
  if (updates.length === 0) {
      return res.status(400).send('No fields provided for update.');
  }

  // Add the WHERE clause
  sql += updates.join(', ') + ' WHERE PatientID = ?';
  params.push(patientId);

  db.query(sql, params, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error updating patient information');
      }
      res.send('Patient information updated successfully');
  });
});


// Cleanup on exit
process.on('SIGINT', () => {
  db.end(err => {
    if (err) {
      console.error('Error closing the database connection:', err);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

// Get Patient Count by Condition
app.get('/getPatientCountByCondition/:condition', (req, res) => {
  const { condition } = req.params;
  const sql = 'SELECT GetPatientCountByCondition(?) AS PatientCount';
  db.query(sql, [condition], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error fetching patient count by condition');
      }
      res.json(results[0] || { PatientCount: 0 });
  });
});

const PORT = process.env.DB_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
