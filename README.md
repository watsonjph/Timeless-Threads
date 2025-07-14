# Timeless Threads
*A Dedicated web-based e-commerce platform for Timeless Threads to replace its reliance on Instagram for sales* <br>
The system will streamline product browsing, secure checkout, payment processing (via QR or Gcash), and automate inventory and Order management, Replacing Error-prone manual spreadsheets.

## 🛠 Tech Stack
![Tech Stack](https://skills-icons.vercel.app/api/icons?i=react,tailwind,mysql,node,vite,axios,express)

---

## 📁 Project Structure
```
Timeless-Threads/
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

1. Create a database named `timeless_db` in MySQL:

    ```bash
    CREATE SCHEMA `timeless_db` ;
    ```
    **OR**
    ```bash
    CREATE DATABASE timeless_db;
    ```

2. Clone the repository:

    ```bash
    git clone https://github.com/watsonjph/Timeless-Threads
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
