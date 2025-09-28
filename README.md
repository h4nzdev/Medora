`# <Medora>: AI-Powered Healthcare Management System

Medora (formerly MedConnect) is a comprehensive web application that revolutionizes healthcare management by combining traditional patient-clinic interactions with cutting-edge AI technology. The platform provides seamless appointment scheduling, medical record management, and an intelligent AI symptom checker powered by Google's Gemini AI.

## 🤖 Key Features

### For Patients:
- **AI Symptom Checker:** Get instant, AI-powered health advice using Google's Gemini AI
- **Appointment Management:** Schedule, track, and manage appointments with clinics
- **Medical Records:** Access and manage your complete medical history in one secure place
- **Smart Reminders:** Set and receive personalized reminders for appointments and medications
- **Secure Communication:** Chat directly with healthcare providers
- **Profile Management:** Maintain your personal information and emergency contacts

### For Clinics:
- **Comprehensive Dashboard:** Real-time overview of appointments, patients, and clinic performance
- **Appointment Management:** Handle confirmed and pending appointments efficiently
- **Patient Management:** Access patient profiles, medical records, and communication history
- **Doctor Management:** Add, manage, and organize doctor profiles and schedules
- **AI Chat Monitoring:** Monitor patient interactions with the AI symptom checker
- **Medical Records Management:** Maintain and update patient medical records
- **Subscription Management:** Manage clinic subscriptions and billing
- **Secure Messaging:** Communicate with patients through an integrated chat system

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Context API** - State management for authentication and data
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icon library
- **React Calendar** - Calendar component for appointment scheduling
- **React Toastify** - Toast notifications
- **SweetAlert2** - Beautiful alert dialogs
- **jsPDF** - PDF generation for reports
- **EmailJS** - Email service integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.18.1** - MongoDB object modeling
- **Google Generative AI** - AI integration for symptom checking
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **JWT** - JSON Web Token authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Google AI API key (for Gemini AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/WellBot.git
   cd WellBot
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_ai_api_key
   ```
   
   Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3000`

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   
   Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🎯 Usage

### For Patients
1. **Register/Login:** Create a patient account or sign in
2. **AI Symptom Checker:** Use the chat interface to get AI-powered health advice
3. **Schedule Appointments:** Book appointments with your preferred clinic
4. **View Medical Records:** Access your complete medical history
5. **Set Reminders:** Create reminders for appointments and medications
6. **Chat with Clinic:** Communicate directly with healthcare providers

### For Clinics
1. **Register/Login:** Create a clinic account or sign in
2. **Dashboard Overview:** Monitor appointments, patients, and clinic performance
3. **Manage Appointments:** Handle confirmed and pending appointments
4. **Patient Management:** Access patient profiles and medical records
5. **Doctor Management:** Add and manage doctor profiles
6. **Monitor AI Chats:** Review patient interactions with the AI system
7. **Subscription Management:** Manage billing and subscription plans

## 🤖 AI Features

The platform includes an advanced AI symptom checker powered by Google's Gemini AI:
- **Intelligent Health Advice:** Get personalized health recommendations
- **Symptom Analysis:** Describe symptoms and receive appropriate guidance
- **Emergency Detection:** AI identifies serious symptoms and recommends immediate medical attention
- **Home Remedy Suggestions:** Receive safe home treatment recommendations
- **Professional Disclaimers:** Clear communication that AI advice doesn't replace professional medical consultation

## 📁 Project Structure

```
WellBot/
├── backend/
│   ├── config/          # Database configuration
│   ├── controller/      # API controllers
│   ├── model/          # Database models
│   ├── routes/         # API routes
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   ├── layout/     # Layout components
│   │   ├── page/       # Page components
│   │   ├── routes/     # Route definitions
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
└── README.md
```

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcrypt encryption for user passwords
- **CORS Protection:** Cross-origin request security
- **Role-based Access:** Separate access levels for patients and clinics
- **Data Validation:** Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment

The application can be deployed on various platforms:
- **Frontend:** Vercel, Netlify, or any static hosting service
- **Backend:** Heroku, DigitalOcean, AWS, or any Node.js hosting platform
- **Database:** MongoDB Atlas or self-hosted MongoDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google AI for providing the Gemini AI API
- The React and Node.js communities for excellent documentation
- All contributors who help improve this project

---

**Note:** This application is for educational and demonstration purposes. Always consult with healthcare professionals for medical advice and diagnosis.
`