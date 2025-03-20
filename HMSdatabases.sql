-- Drop the existing database if it exists
DROP DATABASE IF EXISTS HospitalDB;
CREATE DATABASE HospitalDB;
USE HospitalDB;

-- Patient Table
CREATE TABLE Patient (
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
    DateOfDischarge DATE,
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
    RoomCharges DECIMAL(10,2),
    LabCharges DECIMAL(10,2),
    OperationCharges DECIMAL(10,2),
    MedicineCharges DECIMAL(10,2),
    TotalBillAmount DECIMAL(10,2),
    HealthCardApplicable BOOLEAN,
    NumberOfDaysStayed INT,
    PatientType VARCHAR(20),
    BillDate DATE,
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

CREATE TRIGGER After_Patient_Insert
AFTER INSERT ON Patient
FOR EACH ROW
BEGIN
    DECLARE available_room INT;
    DECLARE room_type VARCHAR(50);
    DECLARE room_charges DECIMAL(10,2);

    INSERT INTO Bill (PatientID, RoomCharges, LabCharges, OperationCharges, MedicineCharges, TotalBillAmount, HealthCardApplicable, NumberOfDaysStayed, PatientType, BillDate)
    VALUES (NEW.PatientID, 0.00, 0.00, 0.00, 0.00, 0.00, FALSE, 0, 'Outpatient', CURDATE());

    IF NEW.Condition = 'Severe' THEN
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


-- Trigger to update Room status after patient discharge
CREATE TRIGGER After_Inpatient_Discharge
AFTER UPDATE ON Inpatient
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Discharged' THEN
        -- Update the Room status to 'Available'
        UPDATE Room
        SET Status = 'Available'
        WHERE RoomNo = NEW.RoomNo;
    END IF;
END $$

-- Trigger to calculate total bill after inserting LabReport or Inpatient
CREATE TRIGGER After_Bill_Insert
AFTER INSERT ON Bill
FOR EACH ROW
BEGIN
    DECLARE room_charges DECIMAL(10,2);
    DECLARE lab_charges DECIMAL(10,2);
    DECLARE operation_charges DECIMAL(10,2);
    DECLARE medicine_charges DECIMAL(10,2);
    DECLARE total DECIMAL(10,2);
    
    SET room_charges = IFNULL(NEW.RoomCharges, 0);
    SET lab_charges = IFNULL(NEW.LabCharges, 0);
    SET operation_charges = IFNULL(NEW.OperationCharges, 0);
    SET medicine_charges = IFNULL(NEW.MedicineCharges, 0);
    
    SET total = room_charges + lab_charges + operation_charges + medicine_charges;

    -- No need to update the Bill table here; calculate total in application logic
END $$

DELIMITER ;