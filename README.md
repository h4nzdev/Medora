# Medo-Oral: Dental Clinic Management System

This is a comprehensive dental clinic management system with separate interfaces for clients and clinics, built with the MERN stack.

## Features

### Client-Side

*   **Authentication:** Secure user registration and login.
*   **Appointment Management:** Book, view, and manage appointments.
*   **Medical Records:** Access and view personal medical records.
*   **Real-time Chat:** Communicate with the clinic in real-time.
*   **Notifications & Reminders:** Receive important alerts and reminders.
*   **Invoices:** View and manage invoices.
*   **Reviews:** Provide feedback and reviews for doctors.

### Clinic-Side

*   **Authentication:** Secure login for clinic staff.
*   **Dashboard:** View key statistics and analytics.
*   **Patient Management:** Manage patient information and records.
*   **Doctor Management:** Add, view, and manage doctor profiles.
*   **Appointment Scheduling:** Schedule and manage patient appointments.
*   **Medical Records Management:** Create and manage patient medical records.
*   **Invoice Management:** Generate and manage invoices.
*   **Real-time Chat:** Communicate with patients.

## Tech Stack

### Frontend

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **State Management:** React Context API
*   **Real-time Communication:** Socket.IO Client
*   **HTTP Client:** Axios

### Backend

*   **Framework:** Node.js, Express
*   **Database:** MongoDB with Mongoose
*   **Real-time Communication:** Socket.IO
*   **File Storage:** Cloudinary
*   **Email Services:** Brevo, Resend, Nodemailer
*   **AI:** Google Generative AI

## Getting Started

### Prerequisites

*   Node.js and npm
*   MongoDB
*   Cloudinary Account
*   Email service provider (Brevo, Resend, or Nodemailer)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/medo-oral.git
    cd medo-oral
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the necessary environment variables (e.g., database connection string, API keys).

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
