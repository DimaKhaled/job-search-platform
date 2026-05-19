# 🚀 HireSphere - Your Gateway to Dream Jobs

<div align="center">

![HireSphere Banner](https://img.shields.io/badge/HireSphere-Job%20Platform-success?style=for-the-badge)
![Django](https://img.shields.io/badge/Django-4.2+-092E20?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

**A full-stack job board connecting talented individuals with great companies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Screenshots](#-screenshots) • [Demo](#-demo)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [API Integration](#-api-integration)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Team](#-team)

---

## 🎯 About

**HireSphere** is a comprehensive job search platform built with Django that bridges the gap between talented job seekers and companies looking to hire. The platform provides a seamless experience for both employers posting jobs and candidates searching for their next opportunity.

### Key Highlights
- ✨ **Dual User Roles**: Separate dashboards for companies and job seekers
- 🔍 **Smart Search**: Filter jobs by title, description, and experience level
- 📊 **Application Tracking**: Real-time status updates for job applications
- 🛡️ **Secure Authentication**: Role-based access control and data protection

---

## ✨ Features

### For Job Seekers 👤
- ✅ **User Registration & Login** - Secure authentication system
- 🔍 **Advanced Job Search** - Filter by title, description, and years of experience
- 📝 **Easy Application** - One-click job applications with resume upload
- 📊 **Track Applications** - Monitor application status (Pending/Accepted/Rejected)
- 💼 **Application History** - View all applied jobs in one place
- 📄 **Resume Upload** - Attach your resume to applications

### For Companies/Employers 🏢
- ✅ **Company Registration** - Dedicated employer accounts
- ➕ **Post Jobs** - Create detailed job listings with requirements
- ✏️ **Edit/Delete Jobs** - Manage job postings anytime
- 👥 **View Applicants** - See all candidates who applied
- ✅ **Screen Candidates** - Accept or reject applications
- 📊 **Dashboard Analytics** - Track job performance and applications

---

## 🛠️ Tech Stack

<div align="center">

| Backend | Frontend | Database | Tools |
|---------|----------|----------|-------|
| ![Django](https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white) | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite&logoColor=white) | ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) |
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) |
| | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | | |

</div>

### Key Technologies
- **Django MVT Architecture** - Clean separation of concerns
- **Django ORM** - Efficient database operations with prepared statements
- **AJAX/Fetch API** - Asynchronous data loading without page reloads
- **Server-side Validation** - Secure data handling and error prevention
- **File Upload Handling** - Secure resume and document management

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/HireSphere.git
cd HireSphere
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the server:

```bash
python manage.py runserver
```

Open in browser:

```
http://127.0.0.1:8000/
```

---

## 📸 Screenshots

### 🏠 Home Page
![Home](Screenshots/home.png)

### 👤 User Dashboard
![User Dashboard](Screenshots/user-dashboard.png)

### 🏢 Admin Dashboard
![Admin Dashboard](Screenshots/admin-dashboard.png)

### 💼 Available Jobs
![Jobs](Screenshots/available-jobs.png)
