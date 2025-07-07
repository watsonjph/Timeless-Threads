<img src="client/public/images/logo.jpg" alt="logo" width="96">

# Hydronet-Billing-System
*Web-based solution to automate billing processes, track payments, monitor project status, and manage client records for Hydronet Consultants Inc*
Replacing Error-prone manual spreadsheets.

## 🛠 Tech Stack
![Tech Stack](https://skills-icons.vercel.app/api/icons?i=react,tailwind,mysql,node,vite,axios,express)

---

## 📁 Project Structure
```
Hydronet-Billing-System/
├── server/                       # Backend (Node.js + MySQL)
│   ├── config/                   # Environment/config files
│   ├── controllers/              # Route handlers
│   ├── models/                   # Data models
│   ├── database/                 # Database schema and seed files
│   ├── routes/                   # API route definitions
│   ├── middleware/               # Authentication & RBAC
│   ├── utils/                    # PDF generator, email, etc.
│   └── app.js                    # Express server entry point
│
├── client/                       # Frontend (React + Vite + Tailwind)
│   ├── public/                   # Public static files
│   │   ├── images/               # Logo, icons, etc.
│   │   └── documents/            # Invoice templates
│   ├── src/
│   │   ├── assets/               # Images, icons, fonts
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Main route pages
│   │   ├── api/                  # Axios API service functions
│   │   ├── context/              # Global state (e.g., AuthContext)
│   │   ├── routes/               # React Router setup
├── .env                          # Backend environment variables
├── .gitignore
├── package.json                  # Root (for both server and scripts)
├── config/                       # Config files for Tailwind, Vite and Postcss
└── README.md
```

---

## 📌 Notes
- Backend follows the MVC (Model-View-Controller) Architectural Pattern
- Frontend follows the Component-Based-Architecture Pattern
- Frontend makes API calls (via Axios) to the backend
---

## Prerequisites
- Node.js v18+
- MySQL 8.0+
---
## Setup  
Quick Setup Guide for the Application

1. Create a database named `hydronet_billing` in MySQL:

    ```bash
    CREATE SCHEMA `hydronet_billing` ;
    ```
    **OR**
    ```bash
    CREATE DATABASE hydronet_billing;
    ```

2. Clone the repository:

    ```bash
    git clone https://github.com/watsonjph/Hydronet-Billing-System
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Build the project:

    ```bash
    npm run dev
    ```
    **OR**
    ```bash
    npm run dev:server
    npm run dev:client
    ```
---
