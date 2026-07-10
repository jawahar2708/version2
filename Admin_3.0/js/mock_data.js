/* ============================================================
   SHARED MOCK DATA MODULE
   In-memory data structure for Profiles and Teams
   This replaces localStorage entirely to fulfill static-only requirements.
   ============================================================ */

window.__RPL_DB__ = {
    admin: {
        name: 'Admin Name',
        role: 'Administrator',
        email: 'admin@ilp.com',
        phone: '9876543210'
    },
    faculty: [
        {
            id: 'FAC-001',
            name: 'Dr. Arvind Kumar',
            email: 'arvind@ilp.com',
            phone: '9876543211',
            gender: 'Male',
            dob: '1980-05-15',
            role: 'Associate Professor',
            status: 'Active',
            qualification: 'Ph.D in Computer Science',
            experience: '12 Years',
            specialization: 'Artificial Intelligence',
            joiningDate: '2015-08-01',
            address: '123 University Campus, Block A'
        },
        {
            id: 'FAC-002',
            name: 'Dr. Meena R',
            email: 'meena@ilp.com',
            phone: '9876543212',
            gender: 'Female',
            dob: '1985-11-20',
            role: 'Assistant Professor',
            status: 'Inactive',
            qualification: 'M.Tech in IT',
            experience: '8 Years',
            specialization: 'Cyber Security',
            joiningDate: '2018-01-10',
            address: '45 Faculty Layout, City West'
        },
        {
            id: 'FAC-003',
            name: 'Lakshmi N',
            email: 'lakshmi@ilp.com',
            phone: '9876543213',
            gender: 'Female',
            dob: '1990-03-30',
            role: 'Lab Technician',
            status: 'Active',
            qualification: 'B.Sc Computer Science',
            experience: '5 Years',
            specialization: 'Networking',
            joiningDate: '2020-06-15',
            address: '56 Tech Park Road'
        }
    ],
    trainees: [
        {
            id: 'TRN-001',
            name: 'Rahul Sharma',
            email: 'rahul.s@student.com',
            phone: '9876543221',
            gender: 'Male',
            dob: '2004-05-12',
            role: 'Trainee',
            status: 'Active',
            college: 'Engineering College A',
            batch: '2022-2026',
            qualification: 'B.Tech IT',
            address: 'Hostel 4, Room 12'
        },
        {
            id: 'TRN-002',
            name: 'Priya Patel',
            email: 'priya.p@student.com',
            phone: '9876543222',
            gender: 'Female',
            dob: '2003-11-05',
            role: 'Trainee',
            status: 'Inactive',
            college: 'Engineering College B',
            batch: '2021-2025',
            qualification: 'B.E CSE',
            address: 'Hostel 2, Room 34'
        },
        {
            id: 'TRN-003',
            name: 'Amit Kumar',
            email: 'amit.k@student.com',
            phone: '9876543223',
            gender: 'Male',
            dob: '2005-02-18',
            role: 'Trainee',
            status: 'Active',
            college: 'Engineering College A',
            batch: '2023-2027',
            qualification: 'B.Tech AI',
            address: 'Hostel 1, Room 56'
        }
    ]
};
