**Hospital Management System Documentation**

This documentation provides an overview of the Hospital Management System built using MySQL for the database and Node.js with Express for the backend. The system is designed to manage patients, doctors, rooms, and billing in a hospital setting. Below is a detailed explanation of the database schema, triggers, API endpoints, and frontend functionality.


---

**Live Link**

→ https://dbms-project-sem2.onrender.com/

---

**Documentaion Link**

→ https://docs.google.com/document/d/1oW-9DV-lsgGwefLeIsd_51osxYd6Z_jeAOv41UP02z8/edit?tab=t.0 

---

**Database Schema**

Tables

1. Patient Table
Stores patient information.
Fields:

PatientID (Primary Key, Auto Increment)

FirstName, LastName, Name, Address, Age, Gender, Disease

PatientCondition (Mild, Moderate, Severe)


2. Doctor Table
Stores doctor information.
Fields:

DoctorID (Primary Key, Auto Increment)

DoctorName, Department, Category (Permanent, Visiting, Trainee)


3. Room Table
Stores room information.
Fields:

RoomNo (Primary Key, Auto Increment)

RoomType, Status (Available, Occupied), Charges


4. Inpatient Table
Stores information about admitted patients.
Fields:

InpatientID (Primary Key, Auto Increment)

PatientID (Foreign Key), RoomNo (Foreign Key)

DateOfAdmission, DateOfDischarge, AdvanceAmount, RoomType, Status (Admitted, Discharged)


5. Outpatient Table
Stores information about outpatients.
Fields:

OutpatientID (Primary Key, Auto Increment)

PatientID (Foreign Key), DoctorID (Foreign Key)

ConsultationDate, AdvanceAmount


6. LabReport Table
Stores lab report details.
Fields:

ReportNo (Primary Key, Auto Increment)

PatientID (Foreign Key), DoctorID (Foreign Key)

ReportDate, TestAmount


7. Bill Table
Stores billing information.
Fields:

BillNo (Primary Key, Auto Increment)

PatientID (Foreign Key)

RoomCharges, LabCharges, OperationCharges, MedicineCharges, TotalBillAmount

HealthCardApplicable, NumberOfDaysStayed, PatientType, BillDate


8. Permanent_Doctor Table
Stores extra details for permanent doctors.
Fields:

DoctorID (Primary Key, Foreign Key to Doctor table)

Salary (nullable)

JoiningDate (default CURRENT_DATE if not provided)

ExperienceYears (nullable)


9. Trainee_Doctor Table
Stores extra details for trainee doctors.
Fields:

DoctorID (Primary Key, Foreign Key to Doctor table)

Stipend (nullable)

TrainingEndDate (default CURRENT_DATE if not provided)


10. Visiting_Doctor Table
Stores extra details for visiting doctors.
Fields:

DoctorID (Primary Key, Foreign Key to Doctor table)

ConsultationFee (nullable)

VisitDays (nullable)


11. RoomLog Table
Logs room assignments for debugging.
Fields:

LogID (Primary Key, Auto Increment)

RoomNo, LogDate



---

Triggers

1. After_Doctor_Insert
Automatically categorizes doctors based on their Category:

If Permanent: Inserts into Permanent_Doctor with default Salary, JoiningDate (current date), and ExperienceYears.

If Visiting: Inserts into Visiting_Doctor with default ConsultationFee and VisitDays.

If Trainee: Inserts into Trainee_Doctor with default Stipend and TrainingEndDate (current date).


2. After_Patient_Insert
Handles patient insertion:

Inserts a default bill entry.

If the patient's condition is "Severe":

Assigns an available room.

Inserts into the Inpatient table.

Updates room status to "Occupied".

Logs the room assignment in RoomLog.


If no room is available, raises an error:
No available rooms for severe condition.


3. After_Inpatient_Discharge
Updates the room status to "Available" when a patient is discharged.

4. After_Bill_Insert
Calculates the total bill amount (future logic placeholder).


---

API Endpoints

Doctors

Add Doctor: POST /addDoctor

Get All Doctors: GET /getDoctors

Get Permanent Doctors: GET /getPermanentDoctors

Get Visiting Doctors: GET /getVisitingDoctors

Get Trainee Doctors: GET /getTraineeDoctors

Delete Doctor: DELETE /deleteDoctor/:id


Patients

Add Patient: POST /addPatient

Get All Patients: GET /getPatients

Get Inpatients: GET /getInpatients

Get Outpatients: GET /getOutpatients

Discharge Patient: PUT /dischargePatient/:id


Rooms

Get All Rooms: GET /getRooms


Billing

Generate Bill: POST /addBill



---

Frontend Functionality

HTML Structure

Single-page app with dynamic forms and tables for managing doctors, patients, rooms, and billing.


JavaScript Functions

Doctors

addDoctor() – Adds a new doctor

fetchAllDoctors() – Fetches all doctors

fetchDoctors(category) – Fetches doctors by category

deleteDoctor(id) – Deletes a doctor by ID


Patients

addPatient() – Adds a new patient

fetchPatients() – Fetches all patients



---

Let me know if you want this version exported to .docx or .pdf format — ready for print or submission!

