### **Hospital Management System Documentation**

This documentation provides an overview of the **Hospital Management System** built using **MySQL** for the database and **Node.js** with **Express** for the backend. The system is designed to manage patients, doctors, rooms, and billing in a hospital setting. Below is a detailed explanation of the database schema, triggers, API endpoints, and frontend functionality.

---
### Live Link --> https://dbms-project-sem2.onrender.com/

---
## **Database Schema**

### **Tables**

1. **Patient Table**
   - Stores patient information.
   - Fields:
     - `PatientID` (Primary Key, Auto Increment)
     - `FirstName`, `LastName`, `Name`, `Address`, `Age`, `Gender`, `Disease`
     - `Condition` (Mild, Moderate, Severe)

2. **Doctor Table**
   - Stores doctor information.
   - Fields:
     - `DoctorID` (Primary Key, Auto Increment)
     - `DoctorName`, `Department`, `Category` (Permanent, Visiting, Trainee)

3. **Room Table**
   - Stores room information.
   - Fields:
     - `RoomNo` (Primary Key, Auto Increment)
     - `RoomType`, `Status` (Available, Occupied), `Charges`

4. **Inpatient Table**
   - Stores information about admitted patients.
   - Fields:
     - `InpatientID` (Primary Key, Auto Increment)
     - `PatientID` (Foreign Key), `RoomNo` (Foreign Key)
     - `DateOfAdmission`, `DateOfDischarge`, `AdvanceAmount`, `RoomType`, `Status` (Admitted, Discharged)

5. **Outpatient Table**
   - Stores information about outpatients.
   - Fields:
     - `OutpatientID` (Primary Key, Auto Increment)
     - `PatientID` (Foreign Key), `DoctorID` (Foreign Key)
     - `ConsultationDate`, `AdvanceAmount`

6. **LabReport Table**
   - Stores lab report details.
   - Fields:
     - `ReportNo` (Primary Key, Auto Increment)
     - `PatientID` (Foreign Key), `DoctorID` (Foreign Key)
     - `ReportDate`, `TestAmount`

7. **Bill Table**
   - Stores billing information.
   - Fields:
     - `BillNo` (Primary Key, Auto Increment)
     - `PatientID` (Foreign Key)
     - `RoomCharges`, `LabCharges`, `OperationCharges`, `MedicineCharges`, `TotalBillAmount`
     - `HealthCardApplicable`, `NumberOfDaysStayed`, `PatientType`, `BillDate`

8. **Permanent_Doctor, Trainee_Doctor, Visiting_Doctor Tables**
   - Categorize doctors based on their type.
   - Fields:
     - `Doctorid` (Primary Key, Foreign Key to `Doctor` table)
     - `Doctor_name`, `Dept`

9. **RoomLog Table**
   - Logs room assignments for debugging.
   - Fields:
     - `LogID` (Primary Key, Auto Increment)
     - `RoomNo`, `LogDate`

---

## **Triggers**

1. **After_Doctor_Insert**
   - Automatically categorizes doctors into `Permanent_Doctor`, `Trainee_Doctor`, or `Visiting_Doctor` based on their `Category`.

2. **After_Patient_Insert**
   - Handles patient insertion:
     - Inserts a default bill entry.
     - If the patient's condition is "Severe":
       - Assigns an available room.
       - Updates the `Inpatient` table and marks the room as "Occupied".
       - Logs the room assignment in `RoomLog`.
     - If no room is available, raises an error: `No available rooms for severe condition`.

3. **After_Inpatient_Discharge**
   - Updates the room status to "Available" when a patient is discharged.

4. **After_Bill_Insert**
   - Calculates the total bill amount (currently a placeholder for application logic).

---

## **API Endpoints**

### **Doctors**
- **Add Doctor**: `POST /addDoctor`
  - Adds a new doctor to the `Doctor` table.
- **Get All Doctors**: `GET /getDoctors`
  - Retrieves all doctors.
- **Get Permanent Doctors**: `GET /getPermanentDoctors`
  - Retrieves permanent doctors.
- **Get Visiting Doctors**: `GET /getVisitingDoctors`
  - Retrieves visiting doctors.
- **Get Trainee Doctors**: `GET /getTraineeDoctors`
  - Retrieves trainee doctors.
- **Delete Doctor**: `DELETE /deleteDoctor/:id`
  - Deletes a doctor by ID.

### **Patients**
- **Add Patient**: `POST /addPatient`
  - Adds a new patient to the `Patient` table.
- **Get All Patients**: `GET /getPatients`
  - Retrieves all patients.
- **Get Inpatients**: `GET /getInpatients`
  - Retrieves all inpatients.
- **Get Outpatients**: `GET /getOutpatients`
  - Retrieves all outpatients.
- **Discharge Patient**: `PUT /dischargePatient/:id`
  - Updates an inpatient's status to "Discharged" and frees up the room.

### **Rooms**
- **Get All Rooms**: `GET /getRooms`
  - Retrieves all rooms.

### **Billing**
- **Generate Bill**: `POST /addBill`
  - Generates a bill for a patient.

---

## **Frontend Functionality**

### **HTML Structure**
- The frontend is a single-page application with forms and tables for managing doctors, patients, rooms, and billing.

### **JavaScript Functions**
1. **Doctors**
   - `addDoctor()`: Adds a new doctor.
   - `fetchAllDoctors()`: Fetches all doctors.
   - `fetchDoctors(category)`: Fetches doctors by category.
   - `deleteDoctor(id)`: Deletes a doctor by ID.

2. **Patients**
   - `addPatient()`: Adds a new patient.
   - `fetchPatients()`: Fetches all patients.
   - `fetchInpatients()`: Fetches all inpatients.
   - `fetchOutpatients()`: Fetches all outpatients.
   - `deletePatient(id)`: Deletes a patient by ID.

3. **Rooms**
   - `fetchRooms()`: Fetches all rooms.

4. **Billing**
   - `generateBill()`: Generates a bill for a patient.

5. **Inpatient Management**
   - `updateInpatient()`: Updates an inpatient's status (e.g., discharge).

---

## **Sample Data**

### **Patients**
```sql
INSERT INTO Patient (FirstName, LastName, Name, Address, Age, Gender, Disease, `Condition`)
VALUES
    ('John', 'Doe', 'John Doe', '123 Elm St, NY', 45, 'Male', 'Pneumonia', 'Severe'),
    ('Alice', 'Smith', 'Alice Smith', '456 Pine Rd, LA', 32, 'Female', 'Migraine', 'Mild'),
    ('David', 'Johnson', 'David Johnson', '789 Oak Ave, TX', 60, 'Male', 'Diabetes', 'Moderate');
```

### **Doctors**
```sql
INSERT INTO Doctor (DoctorName, Department, Category)
VALUES
    ('Dr. A Raulji', 'Cardiology', 'Permanent'),
    ('Dr. V Vyas', 'Neurology', 'Permanent'),
    ('Dr. N Paradwa', 'Orthopedics', 'Trainee');
```

### **Rooms**
```sql
INSERT INTO Room (RoomType, Status, Charges)
VALUES
    ('General', 'Available', 200.00),
    ('ICU', 'Available', 1000.00),
    ('Deluxe', 'Occupied', 500.00);
```

---

## **Error Handling**
- If no rooms are available for a severe patient, the trigger raises an error: `No available rooms for severe condition`.
- The `RoomLog` table logs room assignments for debugging purposes.

---

## **How to Run**
1. **Database Setup**:
   - Run the provided SQL script to create the database and tables.
   - Insert sample data using the provided `INSERT` statements.

2. **Backend**:
   - Install dependencies: `npm install express mysql body-parser`.
   - Start the server: `node app.js`.

3. **Frontend**:
   - Open `index.html` in a browser.
   - Use the forms and buttons to interact with the system.

---

This documentation provides a comprehensive guide to the Hospital Management System. For further assistance, refer to the code comments or contact the development team.
