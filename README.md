# BusinessMatch - Business Acquisition Platform

A modern, AI-powered platform connecting business buyers and sellers with streamlined acquisition workflows. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and featuring a beautiful, approachable design.

## 🚀 Features

### Core Platform
- **Smart Matching**: AI-powered algorithms connect buyers and sellers based on preferences, industry, and deal criteria
- **Separate Onboarding**: Comprehensive questionnaires for buyers and sellers with multi-step workflows
- **Profile Management**: Detailed profiles with essential business and investment information
- **Match Management**: Accept/reject functionality with communication tools
- **Deal Workflow**: Streamlined acquisition process with milestone tracking and document management

### AI-Powered Features
- **Document Analysis**: AI-powered financial document analysis and summarization
- **Match Recommendations**: Intelligent matching based on preferences and criteria
- **Negotiation Assistant**: AI insights for deal negotiations
- **Due Diligence Checklists**: Automated generation of industry-specific checklists
- **Business Summaries**: AI-generated executive summaries and valuation insights

### User Experience
- **Modern Design**: Beautiful, approachable interface with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live notifications and status updates
- **Intuitive Navigation**: Clear, guided workflows for complex processes

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Multer** for file uploads
- **Socket.io** for real-time features

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Lucide React** for icons

### AI Integration
- **OpenAI API** for document analysis and insights
- **PDF parsing** for financial document processing
- **Excel processing** for data extraction

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd business-marketplace-platform
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/business-marketplace
   JWT_SECRET=your-secret-key-here
   PORT=5000
   NODE_ENV=development
   OPENAI_API_KEY=your-openai-api-key
   CLOUDINARY_URL=your-cloudinary-url
   ```

4. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   
   # Or start separately
   npm run server  # Starts backend on port 5000
   npm run client  # Starts frontend on port 3000
   ```

## 📁 Project Structure

```
business-marketplace-platform/
├── server/                 # Backend API
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── styles/        # CSS and styling
│   └── public/            # Static assets
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Buyer Routes
- `GET /api/buyers/profile` - Get buyer profile
- `POST /api/buyers/onboarding` - Complete buyer onboarding
- `GET /api/buyers/sellers` - Get available sellers
- `POST /api/buyers/express-interest` - Express interest in seller

### Seller Routes
- `GET /api/sellers/profile` - Get seller profile
- `POST /api/sellers/onboarding` - Complete seller onboarding
- `GET /api/sellers/buyers` - Get potential buyers
- `POST /api/sellers/initiate-contact` - Initiate contact with buyer

### Matches & Deals
- `GET /api/matches` - Get user matches
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id/status` - Update match status
- `GET /api/deals` - Get user deals
- `PUT /api/deals/:id/stage` - Update deal stage

### AI Features
- `POST /api/ai/analyze-document` - Analyze financial documents
- `POST /api/ai/generate-summary` - Generate business summary
- `POST /api/ai/match-recommendations` - Get AI match recommendations
- `POST /api/ai/negotiation-assistant` - Get negotiation insights

## 🎨 Design System

The platform uses a comprehensive design system with:

- **Color Palette**: Primary blues, secondary grays, and semantic colors
- **Typography**: Inter for body text, Poppins for headings
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js for security headers

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or AWS

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🎯 Roadmap

- [ ] Real-time chat functionality
- [ ] Advanced AI matching algorithms
- [ ] Mobile app development
- [ ] Integration with financial services
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced document management
- [ ] Escrow services integration

---

Built with ❤️ for modernizing business acquisitions
# UI-UXFt-project
