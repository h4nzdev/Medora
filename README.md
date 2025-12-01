# Medora - Medical Management System

Medora is a comprehensive full-stack medical management platform that connects patients, clinics, and administrators through a modern, feature-rich web application. Built with a React frontend and Node.js/Express backend, it provides seamless healthcare management with real-time features, secure authentication, and AI-powered assistance.

## Project Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── AdminComponents/     # Admin-specific components
│   ├── ClientComponents/    # Patient-facing components
│   └── ClinicComponents/    # Clinic management components
├── context/             # React context for state management
├── hooks/               # Custom React hooks
├── layout/              # Application layout components
├── page/                # Main page components
│   ├── AdminPages/          # Admin dashboard and management
│   ├── AuthPages/           # Authentication pages
│   ├── ClientPages/         # Patient portal pages
│   ├── ClinicPages/         # Clinic management pages
│   └── LandingPage/         # Public landing pages
├── routes/              # Application routing
├── services/            # API service layers
└── utils/               # Utility functions
```

## User Roles & Features

### Admin
- **Dashboard** with analytics and charts
- **Clinic Management** - View and manage all clinics
- **Patient Management** - Oversee patient accounts and data
- **System Updates** - Platform maintenance and updates
- **Feedback Management** - Review user feedback

### Clinic
- **Dashboard** with clinic analytics
- **Appointment Management** - Schedule and manage appointments
- **Patient Management** - Patient records and profiles
- **Doctor Management** - Staff and scheduling
- **Medical Records** - Digital health records
- **Invoicing & Payments** - Billing and payment processing
- **Calendar** - Schedule management
- **Chat System** - Patient communication
- **Subscriptions** - Plan management

### Patient (Client)
- **Dashboard** - Personal health overview
- **Appointments** - Book and manage appointments
- **Medical Records** - View personal health records
- **Doctor Profiles** - Browse and review healthcare providers
- **Reminders** - Medication and appointment reminders
- **Invoices & Payments** - Bill payment
- **Chat** - Communication with clinics
- **Profile & Settings** - Account management

## Key Features

### Appointment System
- **Multi-step booking process** with real-time availability checking
- **Rescheduling capabilities** with automated notifications
- **Virtual consultations** with integrated video links
- **Automated reminders** for upcoming appointments
- **Calendar integration** for scheduling management

### Medical Records Management
- **Secure digital health records** with encryption
- **Role-based access control** (clinic staff, patients, admins)
- **Medical history tracking** with timeline views
- **Document upload and management** (prescriptions, test results)
- **Patient data portability** and export options

### Communication & AI
- **Real-time chat system** between patients and clinics
- **AI-powered chatbot** for appointment booking and FAQs
- **Push notifications** for appointments and updates
- **Voice recognition** for hands-free navigation
- **Email notifications** for important events

### Payment & Billing
- **Secure payment processing** with multiple gateway support
- **Automated invoicing** and receipt generation
- **Subscription management** for clinic plans
- **Payment history tracking** and reporting
- **Insurance integration** capabilities

### Analytics & Reporting
- **Dashboard analytics** with charts and KPIs
- **Patient demographics** and trend analysis
- **Revenue reporting** for clinics and admins
- **Appointment statistics** and utilization metrics
- **System performance monitoring**

### User Experience Enhancements
- **Responsive design** optimized for mobile and desktop
- **Interactive tour guides** for new user onboarding
- **Progressive Web App (PWA)** for offline capabilities
- **Accessibility compliance** with WCAG standards
- **Multi-language support** for diverse users

## Technology Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Socket.io-client** - Real-time communication
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **React Toastify** - Notification system
- **SweetAlert2** - Modal dialogs
- **Lucide React** - Icon library
- **Vite PWA** - Progressive Web App support

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Cloud-based image and file storage
- **Multer** - File upload handling
- **Nodemailer & Brevo** - Email services
- **Node-cron** - Task scheduling
- **Google Generative AI** - AI-powered features

### Key Libraries & Patterns
- Modal-based UI components
- Tab-based navigation
- Form handling and validation
- Real-time updates with WebSockets
- Role-based access control (RBAC)
- RESTful API design

## Component Architecture

### Common Patterns
- **Modal Components**: Reusable modal dialogs for forms and details
- **Tab Components**: Multi-step forms and content organization
- **Sidebar Components**: Detailed information panels
- **Table Components**: Data display with actions

### State Management
- **AppointmentContext**: Appointment state and actions
- **AuthContext**: Authentication and user sessions
- **ClinicContext**: Clinic-specific data
- **NotificationContext**: Real-time notifications
- **ReminderContext**: Medication and appointment reminders

## UI/UX Features

- **Tour Guides**: Interactive onboarding for key features
- **Voice Recognition**: Hands-free navigation and commands
- **Real-time Updates**: Live data synchronization
- **Accessibility**: Focus on inclusive design

## Security & Privacy

- Role-based access control
- Secure authentication flows
- Protected medical data
- Payment security compliance

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher) and npm
- **MongoDB** database (local or cloud instance)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Git** for version control

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   BREVO_API_KEY=your_brevo_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   For development with auto-restart:
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (default Vite port)

### Usage

#### Development
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`
- Both support hot reloading for development

#### Production
- Build the frontend: `npm run build` in frontend directory
- Start backend: `npm start` in backend directory
- Serve frontend build files through your web server

## Future Enhancements

- Enhanced AI chatbot capabilities
- Advanced analytics and reporting
- Mobile app development
- Integration with medical devices
- Expanded payment gateway support

---

*Medora - Streamlining healthcare management for patients, clinics, and administrators.*