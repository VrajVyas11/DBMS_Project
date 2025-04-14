// const express = require('express');
// const mysql = require('mysql');
// const bodyParser = require('body-parser');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// const db = mysql.createConnection({
//    host: process.env.DB_HOST,
//    port: process.env.DB_PORT,
//    user: process.env.DB_USER,
//    password: process.env.DB_PASSWORD,
//    database: process.env.DB_NAME,
//    ssl: {
//      ca: process.env.SSL_CERT_PATH
//    },
//    multipleStatements: true
// });

// // const db = mysql.createConnection({
// //   host: process.env.DB_HOST,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   database: process.env.DB_NAME,
// // });

// db.connect(async err => {
//   if (err) {
//     console.error('MySQL connection error:', err);
//     return;
//   }
//   console.log('MySQL Connected...');
// });

// // Serve HTML on root URL
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Insert Doctor
// app.post('/addDoctor', (req, res) => {
//   const { DoctorName, Department, Category } = req.body;
//   const sql = 'INSERT INTO Doctor (DoctorName, Department, Category) VALUES (?, ?, ?)';
//   db.query(sql, [DoctorName, Department, Category], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error adding doctor');
//     }
//     res.send('Doctor added successfully');
//   });
// });

// // Get All Doctors
// app.get('/getDoctors', (req, res) => {
//   const sql = 'SELECT * FROM Doctor';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching doctors');
//     }
//     res.json(results);
//   });
// });

// // Get Permanent Doctors
// app.get('/getPermanentDoctors', (req, res) => {
//   const sql = 'SELECT * FROM Permanent_Doctor';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching permanent doctors');
//     }
//     res.json(results);
//   });
// });

// // Get Visiting Doctors
// app.get('/getVisitingDoctors', (req, res) => {
//   const sql = 'SELECT * FROM Visiting_Doctor';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching visiting doctors');
//     }
//     res.json(results);
//   });
// });

// // Get Trainee Doctors
// app.get('/getTraineeDoctors', (req, res) => {
//   const sql = 'SELECT * FROM Trainee_Doctor';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching trainee doctors');
//     }
//     res.json(results);
//   });
// });

// // Delete Doctor
// app.delete('/deleteDoctor/:id', (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM Doctor WHERE DoctorID = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error deleting doctor');
//     }
//     res.send('Doctor deleted successfully');
//   });
// });


// // Delete Patient
// app.delete('/deletePatient/:id', (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM Patient WHERE PatientID = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error deleting doctor');
//     }
//     res.send('Patient deleted successfully');
//   });
// });

// // Add Patient
// app.post('/addPatient', (req, res) => {
//   const { FirstName, LastName, Age, Address, Disease, Gender, PatientCondition } = req.body;
//   const sql = 'INSERT INTO Patient (FirstName, LastName, Age, Address, Disease, Gender, PatientCondition) VALUES (?, ?, ?, ?, ?, ?, ?)';
//   db.query(sql, [FirstName, LastName, Age, Address, Disease, Gender, PatientCondition], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error adding patient');
//     }
//     res.send('Patient added successfully');
//   });
// });

// // Get all Patients
// app.get('/getPatients', (req, res) => {
//   const sql = 'SELECT * FROM Patient';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching patients');
//     }
//     res.json(results);
//   });
// });

// // Get all Inpatients
// app.get('/getInpatients', (req, res) => {
//   const sql = 'SELECT * FROM Inpatient INNER JOIN Patient ON Inpatient.PatientID = Patient.PatientID';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching inpatients');
//     }
//     res.json(results);
//   });
// });

// // Get all Outpatients
// app.get('/getOutpatients', (req, res) => {
//   const sql = 'SELECT * FROM Outpatient INNER JOIN Patient ON Outpatient.PatientID = Patient.PatientID';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching outpatients');
//     }
//     res.json(results);
//   });
// });

// // Get all Rooms
// app.get('/getRooms', (req, res) => {
//   const sql = 'SELECT * FROM Room';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error fetching rooms');
//     }
//     res.json(results);
//   });
// });

// // Discharge Inpatient and Update Room Status
// app.put('/dischargePatient/:id', (req, res) => {
//   const { id } = req.params;
//   const sql = 'UPDATE Inpatient SET Status = "Discharged" WHERE PatientID = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error discharging patient');
//     }
//     res.send('Patient discharged and room status updated');
//   });
// });

// // Generate Bill
// app.post('/addBill', (req, res) => {
//   const { PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges } = req.body;
//   const sql = 'INSERT INTO Bill (PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges) VALUES (?, ?, ?, ?, ?)';
//   db.query(sql, [PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error generating bill');
//     }
//     res.send('Bill generated successfully');
//   });
// });

// // Calculate Total Bill for a Patient
// app.get('/calculateTotalBill/:patientId', (req, res) => {
//   const { patientId } = req.params;
//   if (isNaN(patientId)) {
//     return res.status(400).send('Invalid patient ID');
//   }
//   const sql = 'SELECT CalculateTotalBill(?) AS TotalBill';
//   db.query(sql, [patientId], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error calculating total bill');
//     }
//     res.json(results[0]);
//   });
// });

// // Check if a Room is Available
// app.get('/isRoomAvailable/:roomType', (req, res) => {
//   const { roomType } = req.params;
//   const sql = 'SELECT IsRoomAvailable(?) AS IsAvailable';
//   db.query(sql, [roomType], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error checking room availability');
//     }
//     res.json(results[0]);
//   });
// });

// // Admit a Patient as Inpatient
// app.post('/admitPatient', (req, res) => {
//   const { patientId, roomType, advanceAmount } = req.body;
//   const sql = 'CALL AdmitPatient(?, ?, ?)';
//   db.query(sql, [patientId, roomType, advanceAmount], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error admitting patient');
//     }
//     res.send('Patient admitted successfully');
//   });
// });

// // Discharge a Patient
// app.put('/dischargePatient/:patientId', (req, res) => {
//   const { patientId } = req.params;
//   const { dischargeDate } = req.body;
//   const sql = 'CALL DischargePatient(?, ?)';
//   db.query(sql, [patientId, dischargeDate], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error discharging patient');
//     }
//     res.send('Patient discharged successfully');
//   });
// });

// // Update Patient Info
// app.put('/updatePatientInfo', (req, res) => {
//   const { patientId, firstName, lastName, address, age, gender, disease, condition } = req.body;

//   // Build the SQL update query dynamically based on provided fields
//   let sql = 'UPDATE Patient SET ';
//   const updates = [];
//   const params = [];

//   if (firstName) {
//       updates.push('FirstName = ?');
//       params.push(firstName);
//   }
//   if (lastName) {
//       updates.push('LastName = ?');
//       params.push(lastName);
//   }
//   if (address) {
//       updates.push('Address = ?');
//       params.push(address);
//   }
//   if (age) {
//       updates.push('Age = ?');
//       params.push(age);
//   }
//   if (gender) {
//       updates.push('Gender = ?');
//       params.push(gender);
//   }
//   if (disease) {
//       updates.push('Disease = ?');
//       params.push(disease);
//   }
//   if (condition) {
//       updates.push('PatientCondition = ?');
//       params.push(condition);
//   }

//   // Ensure that at least one field is provided for update
//   if (updates.length === 0) {
//       return res.status(400).send('No fields provided for update.');
//   }

//   // Add the WHERE clause
//   sql += updates.join(', ') + ' WHERE PatientID = ?';
//   params.push(patientId);

//   db.query(sql, params, (err, result) => {
//       if (err) {
//           console.error(err);
//           return res.status(500).send('Error updating patient information');
//       }
//       res.send('Patient information updated successfully');
//   });
// });


// // Cleanup on exit
// process.on('SIGINT', () => {
//   db.end(err => {
//     if (err) {
//       console.error('Error closing the database connection:', err);
//     }
//     console.log('Database connection closed.');
//     process.exit(0);
//   });
// });

// // Get Patient Count by Condition
// app.get('/getPatientCountByCondition/:condition', (req, res) => {
//   const { condition } = req.params;
//   const sql = 'SELECT GetPatientCountByCondition(?) AS PatientCount';
//   db.query(sql, [condition], (err, results) => {
//       if (err) {
//           console.error(err);
//           return res.status(500).send('Error fetching patient count by condition');
//       }
//       res.json(results[0] || { PatientCount: 0 });
//   });
// });

// const PORT = process.env.DB_PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



//##############################################################################################
//##                                                                                          ##
//##             Aiven.io Production Ready code                                               ##
//##             Table,Procedure,functions & Triggers                                         ##
//##                                                                                          ##
//##                                                                                          ##
//##############################################################################################
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure database connection
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

// Connect to database
db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL Connected to Aiven database...');
});

// Serve HTML on root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// DOCTOR ROUTES
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

// PATIENT ROUTES
// Delete Patient
app.delete('/deletePatient/:id', (req, res) => {
  const { id } = req.params;

  const deleteBill = 'DELETE FROM Bill WHERE PatientID = ?';
  const deleteInpatient = 'DELETE FROM Inpatient WHERE PatientID = ?';
  const deleteOutpatient = 'DELETE FROM Outpatient WHERE PatientID = ?';
  const deletePatient = 'DELETE FROM Patient WHERE PatientID = ?';

  db.query(deleteBill, [id], (err) => {
    if (err) return res.status(500).send('Error deleting from Bill');

    db.query(deleteInpatient, [id], (err) => {
      if (err) return res.status(500).send('Error deleting from Inpatient');

      db.query(deleteOutpatient, [id], (err) => {
        if (err) return res.status(500).send('Error deleting from Outpatient');

        db.query(deletePatient, [id], (err) => {
          if (err) return res.status(500).send('Error deleting patient');
          res.send('Patient deleted successfully');
        });
      });
    });
  });
});


// Add Patient
app.post('/addPatient', (req, res) => {
  const { FirstName, LastName, Address, Age, Gender, Disease, PatientCondition } = req.body;
  
  // Validate required fields
  if (!FirstName || !LastName || !Address || !Age || !Gender) {
    return res.status(400).json({ 
      error: 'Missing required fields. FirstName, LastName, Address, Age, and Gender are required.' 
    });
  }

  // Validate age is a number
  if (isNaN(Age) || Age < 0 || Age > 120) {
    return res.status(400).json({ 
      error: 'Invalid age. Age must be a number between 0 and 120.' 
    });
  }

  // Create the Name field by concatenating FirstName and LastName
  const Name = `${FirstName} ${LastName}`.trim();
  
  const sql = `INSERT INTO Patient 
            (FirstName, LastName, Name, Address, Age, Gender, Disease, PatientCondition) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, 
    [FirstName, LastName, Name, Address, Age, Gender, Disease || null, PatientCondition || null], 
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Error adding patient',
          details: err.message 
        });
      }
      
      // Return the newly created patient ID
      res.status(201).json({ 
        message: 'Patient added successfully',
        patientId: result.insertId 
      });
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

// Update Room Status
app.put('/updateRoomStatus/:roomNo', (req, res) => {
  const { roomNo } = req.params;
  const { status } = req.body;
  const sql = 'UPDATE Room SET Status = ? WHERE RoomNo = ?';
  db.query(sql, [status, roomNo], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating room status');
    }
    res.send('Room status updated successfully');
  });
});

// Add Room Log
app.post('/addRoomLog', (req, res) => {
  const { RoomNo } = req.body;
  const sql = 'INSERT INTO RoomLog (RoomNo) VALUES (?)';
  db.query(sql, [RoomNo], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding room log');
    }
    res.send('Room log added successfully');
  });
});

// Update Patient Info
app.put('/updatePatientInfo', (req, res) => {
  const { patientId, firstName, lastName, address, age, gender, disease, patientCondition } = req.body;

  // Validate patientId exists
  if (!patientId) {
    return res.status(400).send('Patient ID is required');
  }

  // Build the SQL update query dynamically
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
    params.push(Number(age)); // Ensure age is a number
  }
  if (gender) {
    updates.push('Gender = ?');
    params.push(gender);
  }
  if (disease) {
    updates.push('Disease = ?');
    params.push(disease);
  }
  if (patientCondition) {
    updates.push('Condition = ?');
    params.push(patientCondition);
  }

  if (updates.length === 0) {
    return res.status(400).send('No fields provided for update');
  }

  sql += updates.join(', ') + ' WHERE PatientID = ?';
  params.push(patientId);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating patient information');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Patient not found');
    }
    res.send('Patient information updated successfully');
  });
});

// LAB REPORT ROUTES
// Add Lab Report
app.post('/addLabReport', (req, res) => {
  const { PatientID, DoctorID, ReportDate, TestAmount } = req.body;
  const sql = 'INSERT INTO LabReport (PatientID, DoctorID, ReportDate, TestAmount) VALUES (?, ?, ?, ?)';
  db.query(sql, [PatientID, DoctorID, ReportDate, TestAmount], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding lab report');
    }
    res.send('Lab report added successfully');
  });
});

// Get Lab Reports for a Patient
app.get('/getLabReports/:patientId', (req, res) => {
  const { patientId } = req.params;
  const sql = 'SELECT * FROM LabReport WHERE PatientID = ?';
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching lab reports');
    }
    res.json(results);
  });
});

// BILLING AND DISCHARGE ROUTES
// Discharge a Patient
app.put('/dischargePatient/:patientId', (req, res) => {
  const { patientId } = req.params;
  const { DateOfDischarge } = req.body;

  const updateSql = "UPDATE Inpatient SET DateOfDischarge = ?, Status = 'Discharged' WHERE PatientID = ? AND Status = 'Admitted'";
  
  db.query(updateSql, [DateOfDischarge, patientId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error discharging patient');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('No admitted patient found with this ID');
    }

    const getRoomSql = 'SELECT RoomNo FROM Inpatient WHERE PatientID = ?';
    db.query(getRoomSql, [patientId], (roomErr, roomResult) => {
      if (roomErr || roomResult.length === 0) {
        console.error(roomErr);
        return res.status(500).send('Error updating room status after discharge');
      }

      const roomNo = roomResult[0].RoomNo;
      const updateRoomSql = "UPDATE Room SET Status = 'Available' WHERE RoomNo = ?";
      db.query(updateRoomSql, [roomNo], (roomUpdateErr) => {
        if (roomUpdateErr) {
          console.error(roomUpdateErr);
          return res.status(500).send('Error updating room status');
        }

        res.send('Patient discharged successfully and room marked as available');
      });
    });
  });
});


// Generate Bill
app.post('/generateBill', (req, res) => {
  const { PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges, HealthCardApplicable, PatientType } = req.body;
  
  // If it's an inpatient, calculate the number of days stayed
  if (PatientType === 'Inpatient') {
    const getDaysSql = 'SELECT DATEDIFF(DateOfDischarge, DateOfAdmission) AS NumberOfDaysStayed FROM Inpatient WHERE PatientID = ? AND Status = "Discharged"';
    db.query(getDaysSql, [PatientID], (err, daysResult) => {
      if (err || daysResult.length === 0) {
        console.error(err);
        return res.status(500).send('Error calculating days stayed');
      }
      
      const numberOfDaysStayed = daysResult[0].NumberOfDaysStayed;
      const totalBillAmount = parseFloat(RoomCharges) + parseFloat(LabCharges) + 
                              parseFloat(OperationCharges) + parseFloat(MedicineCharges);
      
      const sql = 'INSERT INTO Bill (PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges, TotalBillAmount, HealthCardApplicable, NumberOfDaysStayed, PatientType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(sql, [
        PatientID, 
        RoomCharges, 
        LabCharges, 
        OperationCharges, 
        MedicineCharges, 
        totalBillAmount,
        HealthCardApplicable ? 1 : 0,
        numberOfDaysStayed,
        PatientType
      ], (insertErr, result) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).send('Error generating bill');
        }
        res.send('Bill generated successfully');
      });
    });
  } else {
    // For outpatients, we don't need days stayed calculation
    const totalBillAmount = parseFloat(RoomCharges) + parseFloat(LabCharges) + 
                            parseFloat(OperationCharges) + parseFloat(MedicineCharges);
    
    const sql = 'INSERT INTO Bill (PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges, TotalBillAmount, HealthCardApplicable, NumberOfDaysStayed, PatientType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [
      PatientID, 
      RoomCharges, 
      LabCharges, 
      OperationCharges, 
      MedicineCharges, 
      totalBillAmount,
      HealthCardApplicable ? 1 : 0,
      0, // No days stayed for outpatients
      PatientType
    ], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error generating bill');
      }
      res.send('Bill generated successfully');
    });
  }
});

// Get Bills for a Patient
app.get('/calculateTotalBill/:patientId', (req, res) => {
  const { patientId } = req.params;
  const sql = 'SELECT * FROM Bill WHERE PatientID = ? ORDER BY BillDate DESC';
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching bills');
    }
    res.json(results);
  });
});

// ADMISSION ROUTES
// Check if a Room is Available
app.get('/isRoomAvailable/:roomType', (req, res) => {
  const { roomType } = req.params;
  const sql = 'SELECT * FROM Room WHERE RoomType = ? AND Status = ?';
  db.query(sql, [roomType, 'Available'], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error checking room availability');
    }
    res.json(results);
  });
});


// Admit a Patient as Inpatient
app.post('/admitPatient', (req, res) => {
  const { PatientID, RoomType, AdvanceAmount } = req.body;

  // Validate the RoomType
  if (!RoomType || RoomType.trim() === '') {
    return res.status(400).send('RoomType is required and cannot be empty');
  }

  // Find an available room based on RoomType
  const findAvailableRoomSql = 'SELECT RoomNo FROM Room WHERE RoomType = ? AND TRIM(Status) = \'Available\' LIMIT 1';
  db.query(findAvailableRoomSql, [RoomType], (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      return res.status(400).send('No available room of the selected type');
    }

    const RoomNo = results[0].RoomNo;  // Room number from available room

    // Check if room is available again just to be sure (it might be taken after the query)
    const checkRoomSql = 'SELECT Status FROM Room WHERE RoomNo = ?';
    db.query(checkRoomSql, [RoomNo], (checkErr, checkResult) => {
      if (checkErr || checkResult.length === 0 || checkResult[0].Status !== 'Available') {
        return res.status(400).send('Room is no longer available');
      }

      // Begin transaction
      db.beginTransaction(transErr => {
        if (transErr) {
          console.error(transErr);
          return res.status(500).send('Transaction error');
        }

        // Create Inpatient record
        const inpatientSql = 'INSERT INTO Inpatient (PatientID, RoomNo, DateOfAdmission, AdvanceAmount, RoomType, Status) VALUES (?, ?, NOW(), ?, ?, \'Admitted\')';
        db.query(inpatientSql, [PatientID, RoomNo, AdvanceAmount, RoomType], (inpatientErr, inpatientResult) => {
          if (inpatientErr) {
            return db.rollback(() => {
              console.error(inpatientErr);
              res.status(500).send('Error creating inpatient record');
            });
          }

          // Update room status
          const updateRoomSql = 'UPDATE Room SET Status = \'Occupied\' WHERE RoomNo = ?';
          db.query(updateRoomSql, [RoomNo], (roomErr) => {
            if (roomErr) {
              return db.rollback(() => {
                console.error(roomErr);
                res.status(500).send('Error updating room status');
              });
            }

            // Add room log
            const logSql = 'INSERT INTO RoomLog (RoomNo) VALUES (?)';
            db.query(logSql, [RoomNo], (logErr) => {
              if (logErr) {
                return db.rollback(() => {
                  console.error(logErr);
                  res.status(500).send('Error logging room change');
                });
              }

              // Commit transaction
              db.commit(commitErr => {
                if (commitErr) {
                  return db.rollback(() => {
                    console.error(commitErr);
                    res.status(500).send('Error committing transaction');
                  });
                }
                res.send('Patient admitted successfully');
              });
            });
          });
        });
      });
    });
  });
});




// Register Outpatient
app.post('/registerOutpatient', (req, res) => {
  const { PatientID, DoctorID, ConsultationDate, AdvanceAmount } = req.body;
  const sql = 'INSERT INTO Outpatient (PatientID, DoctorID, ConsultationDate, AdvanceAmount) VALUES (?, ?, ?, ?)';
  db.query(sql, [PatientID, DoctorID, ConsultationDate, AdvanceAmount], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error registering outpatient');
    }
    res.send('Outpatient registered successfully');
  });
});

// ANALYTICS ROUTES
// Get Patient Count by Specific Disease
app.get('/getPatientsByDisease/:disease', (req, res) => {
  const { disease } = req.params;
  const sql = 'SELECT COUNT(*) AS PatientCount FROM Patient WHERE PatientCondition = ?';
  db.query(sql, [disease], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching patient count by disease');
    }
    res.json(results[0]);  // Return the first result, which has the count
  });
});


// Get Patient Distribution by Disease
app.get('/getPatientsByDisease', (req, res) => {
  const sql = 'SELECT Disease, COUNT(*) AS PatientCount FROM Patient GROUP BY Disease ORDER BY PatientCount DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching patient distribution by disease');
    }
    res.json(results);
  });
});

// Get Room Occupancy Rate
app.get('/getRoomOccupancyRate', (req, res) => {
  const sql = 'SELECT RoomType, COUNT(*) as Total, SUM(CASE WHEN Status = "Occupied" THEN 1 ELSE 0 END) as Occupied, (SUM(CASE WHEN Status = "Occupied" THEN 1 ELSE 0 END) / COUNT(*)) * 100 as OccupancyRate FROM Room GROUP BY RoomType';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error calculating room occupancy rate');
    }
    res.json(results);
  });
});

// Get Average Stay Duration
app.get('/getAverageStayDuration', (req, res) => {
  const sql = 'SELECT AVG(DATEDIFF(DateOfDischarge, DateOfAdmission)) as AverageStayDays FROM Inpatient WHERE DateOfDischarge IS NOT NULL';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error calculating average stay duration');
    }
    res.json(results[0]);
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

// Add this temporarily to your server.js to debug
app.get('/test-db', (req, res) => {
  db.query('SELECT * FROM Doctor LIMIT 5', (err, results) => {
    if (err) {
      console.error('Test query error:', err);
      return res.status(500).send('Error testing database');
    }
    res.json({
      message: 'Database connection test',
      data: results,
      connectionInfo: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});