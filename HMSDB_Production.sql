-- Drop the existing database if it exists
DROP DATABASE IF EXISTS HospitalDB;
CREATE DATABASE HospitalDB;
USE HospitalDB;

-- Patient Table
CREATE TABLE Patient(
    PatientID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Name VARCHAR(100),
    Address VARCHAR(255),
    Age INT,
    Gender VARCHAR(10),
    Disease VARCHAR(100),
    `Condition` VARCHAR(50) -- ('Mild', 'Moderate', 'Severe')
);

CREATE TABLE RoomLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    RoomNo INT,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Table
CREATE TABLE Doctor (
    DoctorID INT PRIMARY KEY AUTO_INCREMENT,
    DoctorName VARCHAR(100),
    Department VARCHAR(100),
    Category VARCHAR(50) -- ('Permanent', 'Visiting', 'Trainee')
);

-- Room Table
CREATE TABLE Room (
    RoomNo INT PRIMARY KEY AUTO_INCREMENT,
    RoomType VARCHAR(50),
    Status VARCHAR(50), -- ('Available', 'Occupied')
    Charges DECIMAL(10,2)
);

-- Inpatient Table
CREATE TABLE Inpatient (
    InpatientID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    RoomNo INT,
    DateOfAdmission DATE,
    DateOfDischarge DATE NULL,
    AdvanceAmount DECIMAL(10,2),
    RoomType VARCHAR(50),
    Status VARCHAR(20), -- ('Admitted', 'Discharged')
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (RoomNo) REFERENCES Room(RoomNo)
);

-- Outpatient Table
CREATE TABLE Outpatient (
    OutpatientID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    DoctorID INT,
    ConsultationDate DATE,
    AdvanceAmount DECIMAL(10,2),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);

-- Lab Report Table
CREATE TABLE LabReport (
    ReportNo INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    DoctorID INT,
    ReportDate DATE,
    TestAmount DECIMAL(10,2),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);

-- Bill Table
CREATE TABLE Bill (
    BillNo INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    RoomCharges DECIMAL(10,2) DEFAULT 0.00,
    LabCharges DECIMAL(10,2) DEFAULT 0.00,
    OperationCharges DECIMAL(10,2) DEFAULT 0.00,
    MedicineCharges DECIMAL(10,2) DEFAULT 0.00,
    TotalBillAmount DECIMAL(10,2) DEFAULT 0.00,
    HealthCardApplicable BOOLEAN DEFAULT FALSE,
    NumberOfDaysStayed INT DEFAULT 0,
    PatientType VARCHAR(20),
    BillDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID)
);

-- Permanent, Trainee, and Visiting Doctor Tables
CREATE TABLE Permanent_Doctor (
    Doctorid INT PRIMARY KEY,
    Doctor_name VARCHAR(100),
    Dept VARCHAR(100),
    FOREIGN KEY (Doctorid) REFERENCES Doctor(DoctorID) ON DELETE CASCADE
);

CREATE TABLE Trainee_Doctor (
    Doctorid INT PRIMARY KEY,
    Doctor_name VARCHAR(100),
    Dept VARCHAR(100),
    FOREIGN KEY (Doctorid) REFERENCES Doctor(DoctorID) ON DELETE CASCADE
);

CREATE TABLE Visiting_Doctor (
    Doctorid INT PRIMARY KEY,
    Doctor_name VARCHAR(100),
    Dept VARCHAR(100),
    FOREIGN KEY (Doctorid) REFERENCES Doctor(DoctorID) ON DELETE CASCADE
);

INSERT INTO Patient (FirstName, LastName, Name, Address, Age, Gender, Disease, `Condition`) 
VALUES 
('John', 'Doe', 'John Doe', '123 Street, NY', 35, 'Male', 'Flu', 'Mild'),
('Jane', 'Smith', 'Jane Smith', '456 Avenue, CA', 28, 'Female', 'Fracture', 'Severe'),
('Michael', 'Brown', 'Michael Brown', '789 Road, TX', 42, 'Male', 'Diabetes', 'Moderate');

INSERT INTO Room (RoomType, Status, Charges) 
VALUES 
('Single', 'Available', 500.00),
('Deluxe', 'Occupied', 1000.00),
('General', 'Available', 300.00);

INSERT INTO Doctor (DoctorName, Department, Category) 
VALUES 
('Dr. Smith', 'Cardiology', 'Permanent'),
('Dr. Johnson', 'Neurology', 'Trainee'),
('Dr. Williams', 'Orthopedics', 'Visiting');

INSERT INTO Inpatient (PatientID, RoomNo, DateOfAdmission, DateOfDischarge, AdvanceAmount, RoomType, Status) 
VALUES 
(1, 2, '2024-03-01', NULL, 2000.00, 'Deluxe', 'Admitted'),
(2, 3, '2024-03-05', '2024-03-10', 1000.00, 'General', 'Discharged');

INSERT INTO Outpatient (PatientID, DoctorID, ConsultationDate, AdvanceAmount) 
VALUES 
(3, 1, '2024-03-15', 500.00),
(2, 2, '2024-03-18', 600.00);

INSERT INTO LabReport (PatientID, DoctorID, ReportDate, TestAmount) 
VALUES 
(1, 1, '2024-03-02', 1200.00),
(2, 2, '2024-03-06', 900.00);

INSERT INTO Bill (PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges, TotalBillAmount, HealthCardApplicable, NumberOfDaysStayed, PatientType, BillDate) 
VALUES 
(1, 5000.00, 1200.00, 0.00, 300.00, 6500.00, FALSE, 10, 'Inpatient', NOW()),
(2, 3000.00, 900.00, 0.00, 200.00, 4100.00, TRUE, 5, 'Outpatient', NOW());

INSERT INTO Permanent_Doctor (Doctorid, Doctor_name, Dept) 
VALUES 
(1, 'Dr. Smith', 'Cardiology');

INSERT INTO Trainee_Doctor (Doctorid, Doctor_name, Dept) 
VALUES 
(2, 'Dr. Johnson', 'Neurology');

INSERT INTO Visiting_Doctor (Doctorid, Doctor_name, Dept) 
VALUES 
(3, 'Dr. Williams', 'Orthopedics');

INSERT INTO RoomLog (RoomNo, LogDate) 
VALUES 
(2, NOW()),
(3, NOW());


-- -- Triggers   --- Working in the production ✅
## Trigger1
-- DELIMITER $$

-- CREATE TRIGGER After_Doctor_Insert
-- AFTER INSERT ON Doctor
-- FOR EACH ROW
-- BEGIN
--     IF NEW.Category = 'Permanent' THEN
--         INSERT INTO Permanent_Doctor (Doctorid, Doctor_name, Dept)
--         VALUES (NEW.DoctorID, NEW.DoctorName, NEW.Department);
--     ELSEIF NEW.Category = 'Visiting' THEN
--         INSERT INTO Visiting_Doctor (Doctorid, Doctor_name, Dept)
--         VALUES (NEW.DoctorID, NEW.DoctorName, NEW.Department);
--     ELSEIF NEW.Category = 'Trainee' THEN
--         INSERT INTO Trainee_Doctor (Doctorid, Doctor_name, Dept)
--         VALUES (NEW.DoctorID, NEW.DoctorName, NEW.Department);
--     END IF;
-- END$$

-- DELIMITER ;

### Trigger2 After_Patient_Insert
-- DELIMITER $$

-- CREATE TRIGGER After_Patient_Insert
-- AFTER INSERT ON Patient
-- FOR EACH ROW
-- BEGIN
--     DECLARE available_room INT DEFAULT NULL;
--     DECLARE room_type VARCHAR(50);
--     DECLARE room_charges DECIMAL(10,2);

--     -- Create initial bill record
--     INSERT INTO Bill (PatientID, PatientType, BillDate)
--     VALUES (NEW.PatientID, 'Outpatient', CURRENT_TIMESTAMP);

--     IF NEW.PatientCondition = 'Severe' THEN
--         -- Find available room
--         SELECT RoomNo, RoomType, Charges 
--         INTO available_room, room_type, room_charges
--         FROM Room
--         WHERE Status = 'Available'
--         LIMIT 1;

--         IF available_room IS NOT NULL THEN
--             -- Update room status
--             UPDATE Room 
--             SET Status = 'Occupied' 
--             WHERE RoomNo = available_room;

--             -- Create inpatient record
--             INSERT INTO Inpatient (
--                 PatientID, RoomNo, DateOfAdmission, AdvanceAmount, RoomType, Status
--             )
--             VALUES (
--                 NEW.PatientID, available_room, CURDATE(), room_charges, room_type, 'Admitted'
--             );

--             -- Update bill details
--             UPDATE Bill 
--             SET RoomCharges = room_charges,
--                 PatientType = 'Inpatient'
--             WHERE PatientID = NEW.PatientID;

--             -- Log room assignment
--             INSERT INTO RoomLog (RoomNo) 
--             VALUES (available_room);
--         ELSE
--             SIGNAL SQLSTATE '45000'
--             SET MESSAGE_TEXT = 'No available rooms for severe condition';
--         END IF;
--     ELSE
--         -- Create outpatient record with default doctor (ID 1)
--         INSERT INTO Outpatient (
--             PatientID, DoctorID, ConsultationDate, AdvanceAmount
--         )
--         VALUES (
--             NEW.PatientID, 1, CURDATE(), 0.00
--         );
--     END IF;
-- END$$

-- DELIMITER ;


### Tigger3 ✅ 1. After_Inpatient_Discharge
-- DELIMITER $$

-- CREATE TRIGGER After_Inpatient_Discharge
-- AFTER UPDATE ON Inpatient
-- FOR EACH ROW
-- BEGIN
--     IF NEW.Status = 'Discharged' AND OLD.Status != 'Discharged' THEN
--         UPDATE Room 
--         SET Status = 'Available' 
--         WHERE RoomNo = OLD.RoomNo;
--     END IF;
-- END$$

-- DELIMITER ;

### Tigger4 ✅ 2. After_Bill_Update Trigger
-- DELIMITER $$

-- CREATE TRIGGER After_Bill_Update
-- BEFORE UPDATE ON Bill
-- FOR EACH ROW
-- BEGIN
--     SET NEW.TotalBillAmount = 
--         COALESCE(NEW.RoomCharges, 0) + 
--         COALESCE(NEW.LabCharges, 0) + 
--         COALESCE(NEW.OperationCharges, 0) + 
--         COALESCE(NEW.MedicineCharges, 0);
-- END$$

-- DELIMITER ;


################################    Functions   ############################
###-- Function 1: Calculate the total bill amount for a patient
-- DELIMITER $$

-- CREATE FUNCTION CalculateTotalBill(patient_id INT) 
-- RETURNS DECIMAL(10,2)
-- DETERMINISTIC
-- READS SQL DATA
-- BEGIN
--     DECLARE total DECIMAL(10,2);
    
--     SELECT IFNULL(SUM(
--         COALESCE(RoomCharges, 0) +
--         COALESCE(LabCharges, 0) +
--         COALESCE(OperationCharges, 0) +
--         COALESCE(MedicineCharges, 0)
--     ), 0)
--     INTO total
--     FROM Bill
--     WHERE PatientID = patient_id;
    
--     RETURN total;
-- END$$

-- DELIMITER ;

###-- Function 2: Check if a room is available for a given room type
-- DELIMITER $$

-- CREATE FUNCTION IsRoomAvailable(room_type VARCHAR(50)) 
-- RETURNS TINYINT(1)
-- DETERMINISTIC
-- READS SQL DATA
-- BEGIN
--     DECLARE available TINYINT(1);
    
--     SELECT COUNT(*) > 0
--     INTO available
--     FROM Room
--     WHERE RoomType = room_type AND Status = 'Available';
    
--     RETURN available;
-- END$$

-- DELIMITER ;

### -- Function 3: Get patient count by condition
-- DELIMITER $$

-- CREATE FUNCTION GetPatientCountByCondition(`condition` VARCHAR(50)) 
-- RETURNS INT
-- DETERMINISTIC
-- READS SQL DATA
-- BEGIN
--     DECLARE patient_count INT;

--     SELECT COUNT(*) 
--     INTO patient_count
--     FROM Patient
--     WHERE PatientCondition = `condition`;

--     RETURN patient_count;
-- END$$

-- DELIMITER ;


################### --     procedure        --##########################
-- Procedure 1: Admit a patient to the hospital as an inpatient
-- DELIMITER $$

-- CREATE PROCEDURE AdmitPatient(
--     IN patient_id INT,
--     IN room_type VARCHAR(50),
--     IN advance_amount DECIMAL(10,2)
-- )
-- BEGIN
--     DECLARE available_room INT;
--     DECLARE room_charges DECIMAL(10,2);

--     -- Check if a room is available
--     IF NOT IsRoomAvailable(room_type) THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'No available rooms for the specified room type.';
--     END IF;

--     -- Find an available room
--     SELECT RoomNo, Charges INTO available_room, room_charges
--     FROM Room
--     WHERE RoomType = room_type AND Status = 'Available'
--     LIMIT 1;

--     -- Admit the patient
--     INSERT INTO Inpatient (
--         PatientID, RoomNo, DateOfAdmission, DateOfDischarge,
--         AdvanceAmount, RoomType, Status
--     )
--     VALUES (
--         patient_id, available_room, CURDATE(), NULL,
--         advance_amount, room_type, 'Admitted'
--     );

--     -- Update the room status
--     UPDATE Room
--     SET Status = 'Occupied'
--     WHERE RoomNo = available_room;

--     -- Update the bill with room charges
--     UPDATE Bill
--     SET RoomCharges = room_charges,
--         PatientType = 'Inpatient'
--     WHERE PatientID = patient_id;
-- END$$

-- DELIMITER ;

-- Procedure 2: Discharge a patient and update the room status
-- DELIMITER $$

-- CREATE PROCEDURE DischargePatient(
--     IN patient_id INT,
--     IN discharge_date DATE
-- )
-- BEGIN
--     DECLARE room_no INT;

--     -- Get the room number the patient is occupying
--     SELECT RoomNo INTO room_no
--     FROM Inpatient
--     WHERE PatientID = patient_id AND Status = 'Admitted';

--     -- Check if the patient is admitted and the room was found
--     IF room_no IS NULL THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'No admitted patient found with the given PatientID.';
--     END IF;

--     -- Discharge the patient
--     UPDATE Inpatient
--     SET Status = 'Discharged', DateOfDischarge = discharge_date
--     WHERE PatientID = patient_id;

--     -- Update the room status to available
--     UPDATE Room
--     SET Status = 'Available'
--     WHERE RoomNo = room_no;
-- END$$

-- DELIMITER ;

-- Procedure 3: Update patient information
-- DELIMITER $$

-- CREATE PROCEDURE UpdatePatientInfo(
--     IN patient_id INT,
--     IN first_name VARCHAR(50),
--     IN last_name VARCHAR(50),
--     IN address VARCHAR(255),
--     IN age INT,
--     IN gender VARCHAR(10),
--     IN disease VARCHAR(100),
--     IN `condition` VARCHAR(50)
-- )
-- BEGIN
--     UPDATE Patient
--     SET FirstName = first_name,
--         LastName = last_name,
--         Address = address,
--         Age = age,
--         Gender = gender,
--         Disease = disease,
--         PatientCondition = `condition` -- Updated to use PatientCondition
--     WHERE PatientID = patient_id;
-- END$$

-- DELIMITER ;

-- Procedure 4: Get all bills for a patient
-- DELIMITER $$

-- CREATE PROCEDURE GetAllBillsForPatient(
--     IN patient_id INT
-- )
-- BEGIN
--     SELECT * FROM Bill
--     WHERE PatientID = patient_id;
-- END$$

-- DELIMITER ;
