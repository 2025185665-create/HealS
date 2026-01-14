# HealS – AI-Enabled Student Wellness Monitoring System

## Project Overview
HealS is a web-based AI-enabled wellness monitoring system developed to support students’ mental and physical well-being. The system allows students to record mood, BMI, and timetable information, while counselors and administrators can monitor records and provide feedback. An AI component is integrated to generate personalised wellness tips based on real-time user data.

---

## System Objectives
- Monitor students’ emotional and physical health
- Provide AI-generated wellness recommendations
- Support counselors in reviewing student well-being
- Manage user accounts and system data securely

---

## Target Users
- **Students** – Record mood, BMI, timetable and view feedback  
- **Counselors** – View student records and send feedback  
- **Administrators** – Manage users and system information  

---

## AI Component
The system integrates an AI API to generate personalised wellness tips based on:
- Mood status
- BMI category
- Timetable workload  

The AI performs live inference, producing different recommendations for different user conditions in real time.

---

## Core Features
- User registration and login  
- Mood recording and mood history  
- BMI calculation and BMI history  
- Timetable management  
- Counselor feedback system  
- Admin user management  
- AI-based wellness recommendation generation  

---

## Technologies Used
- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js, Express.js  
- Database: MySQL  
- AI Integration: External AI API  

---

## Environment Configuration
Sensitive credentials are not stored in this repository.

An `.env.example` file is provided. Create your own `.env` file and configure:
- Database connection
- AI API key

---

## How to Run the System
1. Install Node.js  
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open in browser:
   ```
   http://localhost:3000/index.html
   ```

---

## Testing
The system was tested using:
- Unit Testing
- Component Testing
- System Testing
- Non-Functional Testing

All test cases passed successfully.

---


## Project Status
Completed academic prototype demonstrating AI integration, system stability, and functional completeness.
