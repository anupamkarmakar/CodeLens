# 🔍 CodeLens

> **AI-Powered Code Review Platform** - Get intelligent code analysis and suggestions with advanced AI technology.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)

## ✨ Features

- 🤖 **AI-Powered Code Review** - Advanced code analysis using Google's Gemini AI
- 👤 **User Authentication** - Secure JWT-based authentication system
- 💾 **Code Persistence** - Save and retrieve your code reviews
- 🎨 **Syntax Highlighting** - Beautiful code display with highlight.js
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ☁️ **Cloud Database** - MongoDB Atlas for reliable data storage
- 🔄 **Real-time Updates** - Auto-save functionality for user codes

## 🚀 Live Demo

**Frontend**: [CodeLens App](https://codelens-frontend.onrender.com)  
**Backend API**: [CodeLens API](https://codelens-backend.onrender.com)

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)

### Code Editor & AI Review
![Code Editor](./screenshots/editor.png)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Markdown** - Rich markdown rendering
- **Highlight.js** - Syntax highlighting
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Google Gemini AI** - Advanced AI for code analysis
- **bcryptjs** - Password hashing

### Cloud Services
- **MongoDB Atlas** - Cloud database
- **Render** - Deployment platform
- **Google AI Studio** - AI API services

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Google AI Studio API key

### 1. Clone the Repository

```bash
git clone https://github.com/anupamkarmakar/CodeLens.git
cd CodeLens
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm start
# or for development
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
GOOGLE_API_KEY=your-google-ai-api-key
NODE_ENV=development
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Save User Code
```http
POST /auth/save-code
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "function hello() { return 'world'; }",
  "review": "This is a simple function..."
}
```

### AI Review Endpoints

#### Get Code Review
```http
POST /ai/get-response
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "function add(a, b) { return a + b; }"
}
```

## 🏗️ Project Structure

```
CodeLens/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controller/
│   │   │   ├── auth.controller.js   # Authentication logic
│   │   │   └── ai.controller.js     # AI review logic
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT middleware
│   │   ├── models/
│   │   │   └── User.js              # User schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Auth endpoints
│   │   │   └── ai.routes.js         # AI endpoints
│   │   ├── services/
│   │   │   └── ai.services.js       # AI service integration
│   │   └── app.js                   # Express app setup
│   ├── .env                         # Environment variables
│   ├── server.js                    # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx              # Main application
│   │   │   ├── LandingPage.jsx      # Landing page
│   │   │   ├── AuthModal.jsx        # Authentication modal
│   │   │   └── UserProfile.jsx      # User profile
│   │   ├── assets/                  # Static assets
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md                        # This file
```

## 🚀 Deployment

### Deploy to Render

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Deploy Backend**:
   - Create new Web Service on Render
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables

3. **Deploy Frontend**:
   - Create another Web Service
   - Set root directory to `frontend`
   - Build command: `npm install && npm run build`
   - Start command: `npm run preview`
   - Set `VITE_API_URL` to your backend URL

### Environment Variables for Production

Make sure to set these in your Render dashboard:

**Backend Service**:
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_API_KEY`
- `NODE_ENV=production`

**Frontend Service**:
- `VITE_API_URL=https://your-backend-url.onrender.com`

## 🧪 Testing

### Manual Testing

1. **User Registration**: Create a new account
2. **User Login**: Login with credentials
3. **Code Review**: Submit code for AI analysis
4. **Auto-save**: Verify code persistence
5. **Navigation**: Test between landing and editor pages

### API Testing with cURL

```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get code review (replace TOKEN with actual JWT)
curl -X POST http://localhost:3000/ai/get-response \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"prompt":"function hello() { return '\''world'\''; }"}'
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Anupam Karmakar** - [GitHub](https://github.com/anupamkarmakar)
- **Riju Rana** - Developer

## 🙏 Acknowledgments

- Google Gemini AI for advanced code analysis
- MongoDB Atlas for reliable cloud database
- React team for the amazing framework
- Render for seamless deployment
- All contributors and users of this project

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/anupamkarmakar/CodeLens/issues) page
2. Create a new issue if your problem isn't listed
3. Contact the maintainers

---

**Made with ❤️ by the CodeLens Team**
