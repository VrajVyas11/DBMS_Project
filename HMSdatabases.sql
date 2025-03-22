-- Drop the existing database if it exists
DROP DATABASE IF EXISTS HospitalDB;
CREATE DATABASE HospitalDB;
USE HospitalDB;

-- Patient Table
CREATE TABLE Patient (
    PatientID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Address VARCHAR(255),
    Age INT,
    Gender VARCHAR(10),
    Disease VARCHAR(100),
    PatientCondition VARCHAR(50) -- Changed from `Condition` to `PatientCondition`
);

-- Room Log Table
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
    DateOfDischarge DATE,
    AdvanceAmount DECIMAL(10,2),
    RoomType VARCHAR(50),
    Status VARCHAR(20), -- ('Admitted', 'Discharged')
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE,
    FOREIGN KEY (RoomNo) REFERENCES Room(RoomNo)
);

-- Outpatient Table
CREATE TABLE Outpatient (
    OutpatientID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    DoctorID INT,
    ConsultationDate DATE,
    AdvanceAmount DECIMAL(10,2),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE,
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
    RoomCharges DECIMAL(10,2),
    LabCharges DECIMAL(10,2),
    OperationCharges DECIMAL(10,2),
    MedicineCharges DECIMAL(10,2),
    TotalBillAmount DECIMAL(10,2),
    HealthCardApplicable BOOLEAN,
    NumberOfDaysStayed INT,
    PatientType VARCHAR(20),
    BillDate DATE,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE
);

-- Discharge Log Table
CREATE TABLE DischargeLog (
    LogID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    DischargeDate DATE,
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

DELIMITER $$

-- Function 1: Calculate the total bill amount for a patient
CREATE FUNCTION CalculateTotalBill(patient_id INT) RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(10,2);
    
    SELECT IFNULL(SUM(RoomCharges + LabCharges + OperationCharges + MedicineCharges), 0)
    INTO total
    FROM Bill
    WHERE PatientID = patient_id;
    
    RETURN total;
END $$

-- Function 2: Check if a room is available for a given room type
CREATE FUNCTION IsRoomAvailable(room_type VARCHAR(50)) RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE available BOOLEAN;
    
    SELECT COUNT(*) > 0
    INTO available
    FROM Room
    WHERE RoomType = room_type AND Status = 'Available';
    
    RETURN available;
END $$

-- Function 3: Get patient count by condition
CREATE FUNCTION GetPatientCountByCondition(`condition` VARCHAR(50)) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE patient_count INT;
    SELECT COUNT(*) INTO patient_count
    FROM Patient
    WHERE PatientCondition = `condition`; -- Updated to use PatientCondition
    RETURN patient_count;
END $$

-- Procedure 1: Admit a patient to the hospital as an inpatient
CREATE PROCEDURE AdmitPatient(
    IN patient_id INT,
    IN room_type VARCHAR(50),
    IN advance_amount DECIMAL(10,2)
)
BEGIN
    DECLARE available_room INT;
    DECLARE room_charges DECIMAL(10,2);

    -- Check if a room is available
    IF NOT IsRoomAvailable(room_type) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No available rooms for the specified room type.';
    END IF;

    -- Find an available room
    SELECT RoomNo, Charges INTO available_room, room_charges
    FROM Room
    WHERE RoomType = room_type AND Status = 'Available'
    LIMIT 1;

    -- Admit the patient
    INSERT INTO Inpatient (PatientID, RoomNo, DateOfAdmission, DateOfDischarge, AdvanceAmount, RoomType, Status)
    VALUES (patient_id, available_room, CURDATE(), NULL, advance_amount, room_type, 'Admitted');

    -- Update the room status
    UPDATE Room
    SET Status = 'Occupied'
    WHERE RoomNo = available_room;

    -- Update the bill with room charges
    UPDATE Bill
    SET RoomCharges = room_charges, PatientType = 'Inpatient'
    WHERE PatientID = patient_id;
END $$

-- -- Procedure 2: Discharge a patient and update the room status
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

--     -- Discharge the patient
--     UPDATE Inpatient
--     SET Status = 'Discharged', DateOfDischarge = discharge_date
--     WHERE PatientID = patient_id;

--     -- Update the room status to available
--     UPDATE Room
--     SET Status = 'Available'
--     WHERE RoomNo = room_no;
-- END $$

-- Procedure 3: Update patient information
CREATE PROCEDURE UpdatePatientInfo(
    IN patient_id INT,
    IN first_name VARCHAR(50),
    IN last_name VARCHAR(50),
    IN address VARCHAR(255),
    IN age INT,
    IN gender VARCHAR(10),
    IN disease VARCHAR(100),
    IN `condition` VARCHAR(50)
)
BEGIN
    UPDATE Patient
    SET FirstName = first_name,
        LastName = last_name,
        Address = address,
        Age = age,
        Gender = gender,
        Disease = disease,
        PatientCondition = `condition` -- Updated to use PatientCondition
    WHERE PatientID = patient_id;
END $$

-- -- Procedure 4: Get all bills for a patient
-- CREATE PROCEDURE GetAllBillsForPatient(
--     IN patient_id INT
-- )
-- BEGIN
--     SELECT * FROM Bill
--     WHERE PatientID = patient_id;
-- END $$

-- Trigger to categorize doctors after insertion into Doctor table
CREATE TRIGGER After_Doctor_Insert
AFTER INSERT ON Doctor
FOR EACH ROW
BEGIN
    IF NEW.Category = 'Permanent' THEN
        INSERT INTO Permanent_Doctor (Doctorid, Doctor_name, Dept)
        VALUES (NEW.DoctorID, NEW.DoctorName, NEW.Department);
    ELSEIF NEW.Category = 'Visiting' THEN
        INSERT INTO Visiting_Doctor (Doctorid, Doctor_name, Dept)
        VALUES (NEW.DoctorID, NEW.DoctorName, NEW.Department);
    ELSEIF NEW.Category = 'Trainee' THEN
        INSERT INTO Trainee_Doctor (Doctorid, Doctor_name, Dept)
        VALUES (NEW.DoctorID, NEW.DoctorName, NEW.Department);
    END IF;
END $$

-- Trigger to handle patient insertion
CREATE TRIGGER After_Patient_Insert
AFTER INSERT ON Patient
FOR EACH ROW
BEGIN
    DECLARE available_room INT;
    DECLARE room_type VARCHAR(50);
    DECLARE room_charges DECIMAL(10,2);

    INSERT INTO Bill (PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges, TotalBillAmount, HealthCardApplicable, NumberOfDaysStayed, PatientType, BillDate)
    VALUES (NEW.PatientID, 0.00, 0.00, 0.00, 0.00, 0.00, FALSE, 0, 'Outpatient', CURDATE());

    IF NEW.PatientCondition = 'Severe' THEN -- Updated to use PatientCondition
        SELECT RoomNo, RoomType, Charges INTO available_room, room_type, room_charges
        FROM Room
        WHERE Status = 'Available'
        ORDER BY RoomNo
        LIMIT 1;

        -- Log available room for debugging
        INSERT INTO RoomLog (RoomNo) VALUES (available_room);

        IF available_room IS NOT NULL THEN
            INSERT INTO Inpatient (PatientID, RoomNo, DateOfAdmission, DateOfDischarge, AdvanceAmount, RoomType, Status)
            VALUES (NEW.PatientID, available_room, CURDATE(), NULL, room_charges, room_type, 'Admitted');

            UPDATE Room
            SET Status = 'Occupied'
            WHERE RoomNo = available_room;

            UPDATE Bill
            SET RoomCharges = room_charges, PatientType = 'Inpatient'
            WHERE PatientID = NEW.PatientID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No available rooms for severe condition.';
        END IF;
    ELSE
        INSERT INTO Outpatient (PatientID, DoctorID, ConsultationDate, AdvanceAmount)
        VALUES (NEW.PatientID, 1, CURDATE(), 0.00);
    END IF;
END $$

-- Combined trigger to update Room status and log patient discharge
CREATE TRIGGER After_Inpatient_Discharge
AFTER UPDATE ON Inpatient
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Discharged' THEN
        -- Update the Room status to 'Available'
        UPDATE Room
        SET Status = 'Available'
        WHERE RoomNo = NEW.RoomNo;

        -- Log patient discharge
        INSERT INTO DischargeLog (PatientID, DischargeDate)
        VALUES (NEW.PatientID, NEW.DateOfDischarge);
    END IF;
END $$


DELIMITER ;