# 🌐 Intern/Volunteer Registration Web App
A full-stack web application that allows interns or volunteers to register themselves through a form. Admins can view all submitted applicants through a secured admin panel. Built using **HTML, CSS, JS (Frontend)**, **Spring Boot (Backend)**, and **MySQL (Database)**.

---

## ✅ Key Features

- 🏠 Home Page
- 📝 Intern/Volunteer Registration Form
- 📋 Admin Panel to view all applicants
- 🔐 Basic authentication for admin access (JavaScript-based)
- 📡 RESTful API communication with backend
- 🛠️ MySQL integration with Spring Data JPA

---

## 🧰 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla JS)
- **Backend:** Java, Spring Boot, Spring Web, Spring Data JPA
- **Database:** MySQL
- **Build Tool:** Maven
- **Authentication:** JavaScript Prompt (for basic admin protection)

---

## 🗂️ Project Structure
📦 InternVolunteerRegistration/
├── frontend/
│ ├── index.html # Home + Registration form
│ ├── admin.html # Admin dashboard (view applicants)
│ ├── register.js # Handles form submission
│ ├── admin.js # Admin authentication logic
│ └── style.css # Global styling
├── backend/
│ └── src/main/java/com/webBackend/
│ ├── controller/ # REST controllers
│ ├── model/ # JPA entities
│ ├── repository/ # Spring Data JPA interfaces
│ ├── service/ # Business logic
│ └── WebBackendApp.java
├── application.properties # MySQL and JPA config
└── README.md
## Home Page
<img width="3200" height="2000" alt="Screenshot 2025-08-03 035015" src="https://github.com/user-attachments/assets/257d9491-c770-41d6-a223-954d47012189" />

## Registration Page
<img width="3200" height="2000" alt="Screenshot 2025-08-03 035052" src="https://github.com/user-attachments/assets/c7c3f027-5073-421b-ae19-e315830fe2dd" />

## Admin Panel
<img width="3200" height="2000" alt="Screenshot 2025-08-03 035240" src="https://github.com/user-attachments/assets/f4c8da5c-9433-4dcd-a048-96e3dcb7e173" />

