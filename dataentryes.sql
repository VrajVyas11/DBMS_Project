-- Insert Doctors
INSERT INTO Doctor (DoctorName, Department, Category)
VALUES
    ('Dr. A Raulji', 'Cardiology', 'Permanent'),
    ('Dr. V Vyas', 'Neurology', 'Permanent'),
    ('Dr. N Paradwa', 'Orthopedics', 'Trainee'),
    ('Dr. K Prajapati', 'Pediatrics', 'Trainee'),
    ('Dr. E Singh', 'Dermatology', 'Visiting'),
    ('Dr. F Gupta', 'Radiology', 'Visiting');

-- Insert Patients with Condition
INSERT INTO Patient (FirstName, LastName, Address, Age, Gender, Disease, PatientCondition)
VALUES
    ('John', 'Doe', '123 Elm St, NY', 45, 'Male', 'Pneumonia', 'Severe'),
    ('Alice', 'Smith', '456 Pine Rd, LA', 32, 'Female', 'Migraine', 'Mild'),
    ('David', 'Johnson', '789 Oak Ave, TX', 60, 'Male', 'Diabetes', 'Moderate'),
    ('Sara', 'Khan', '321 Maple St, FL', 28, 'Female', 'Fracture', 'Severe'),
    ('Tom', 'Brown', '654 Cedar Ln, IL', 50, 'Male', 'Hypertension', 'Moderate'),
    ('Emily', 'Davis', '111 Birch St, CA', 40, 'Female', 'Asthma', 'Mild');


-- Insert Rooms
INSERT INTO Room (RoomType, Status, Charges)
VALUES
    ('General', 'Available', 200.00),
    ('ICU', 'Available', 1000.00),
    ('Deluxe', 'Occupied', 500.00),
    ('Private', 'Available', 800.00),
    ('Shared', 'Occupied', 150.00),
    ('VIP', 'Available', 1200.00);

