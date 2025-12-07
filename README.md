# Vehicle Rental System

**Live API:** [https://vechile-rent.vercel.app/](https://vechile-rent.vercel.app/)

## 📖 Project Description

The Vehicle Rental System is a comprehensive backend application designed to facilitate seamless vehicle rental operations. It provides a robust API for managing the entire rental lifecycle, from vehicle listing and availability tracking to user booking and administrative oversight. Built with scalability and security in mind, it serves as a solid foundation for any vehicle rental platform.

## ✨ Features

### 🚗 Vehicle Management

- **CRUD Operations:** Add, update, delete, and retrieve vehicle details.
- **Availability Tracking:** Real-time status updates for vehicle availability.

### 📅 Booking System

- **Reservation:** Users can book vehicles for specific dates.
- **Cost Calculation:** Automatic calculation of rental costs based on duration and vehicle type.
- **Status Management:** Track bookings through various stages (active, cancelled, returned).

### 👤 User Management

- **Authentication:** Public registration and login functionality anyone can register and login.
- **Profile Management:** Users can update their personal information.
- **Role-Based Access:** Distinct roles for Admin and User to ensure data security and proper access control.

### 🛡️ Security

- **JWT Authentication:** Secure API endpoints using JSON Web Tokens.
- **Password Encryption:** User passwords are hashed using Bcrypt for enhanced security.

## 🛠 Technology Stack

- **Programming Language:** TypeScript
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM/Query Builder:** `pg` (node-postgres)
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js
- **Environment Management:** Dotenv

## 🚀 Setup Guide

Follow these steps to set up and run the project locally.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <https://github.com/Mahfuj-HSTU/L2A2.git>
    cd L2A2
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configuration:**
    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```env
    PORT=5000
    DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
    JWT_SECRET=your_super_secret_key
    ```

    _Note: Replace `username`, `password`, and `your_database_name` with your actual PostgreSQL credentials._

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The server will start running on `http://localhost:5000`.
