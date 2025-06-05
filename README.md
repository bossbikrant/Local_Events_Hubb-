# Local Events Hub - Tech & Startup Theme

A cross-platform mobile application for discovering and connecting with local tech events, hackathons, and startup meetups.

## 🚀 Project Overview

This mobile app serves as a comprehensive platform for the tech community to discover events, RSVP, and engage with fellow developers and entrepreneurs. Built with React Native principles using Next.js for demonstration purposes.

## 🎯 Selected Theme: Tech & Startup

**Theme Rationale:** The Tech & Startup theme was selected to address the growing need for developers, entrepreneurs, and tech enthusiasts to connect and collaborate. This theme allows us to showcase:

- **Relevant Content**: Hackathons, coding workshops, startup pitch nights, and tech meetups
- **Target Audience**: Developers, entrepreneurs, investors, and tech students  
- **Community Building**: Fostering innovation and collaboration in the tech ecosystem
- **Professional Growth**: Career development through networking and skill-building events

## ✨ Core Features

### 🔐 User Authentication
- Secure login and registration system
- JWT token-based authentication
- User profile management
- Password encryption with bcrypt

### 📅 Event Discovery
- Browse tech events, hackathons, and meetups
- Advanced search and filtering capabilities
- Category-based organization (Hackathon, Workshop, Meetup, Networking)
- Real-time event updates

### 🎫 RSVP System
- One-click event registration
- Attendance tracking and limits
- Visual indicators for event capacity
- Personal event calendar

### 💬 Real-time Commenting
- Live discussion threads for each event
- User engagement and community building
- Real-time updates using WebSocket simulation
- Comment moderation capabilities

### 👤 User Profiles
- Customizable user profiles with bio and interests
- Event history and statistics
- Interest-based recommendations
- Social networking features

### 🔒 Security & Best Practices
- Input validation and sanitization
- Secure API endpoints
- Role-based access control
- Cross-platform compatibility

## 🛠 Technology Stack

### Frontend
- **Framework**: React Native (demonstrated with Next.js)
- **State Management**: React Context API
- **Navigation**: React Navigation
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend (Planned Implementation)
- **Runtime**: Node.js with Express.js
- **Database**: MySQL or Firebase Firestore
- **Authentication**: JWT or Firebase Auth
- **API**: RESTful endpoints
- **Real-time**: WebSockets or Firebase Real-time Database

### Development Tools
- **Version Control**: Git with GitHub
- **API Testing**: Postman
- **Collaboration**: Microsoft Teams
- **Design**: Figma (for UI/UX mockups)

## 📱 App Structure

\`\`\`
src/
├── components/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── EventsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── EventCard.tsx
│   ├── EventDetails.tsx
│   └── MainApp.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── EventContext.tsx
├── hooks/
│   └── useAuth.ts
└── utils/
    └── api.ts
\`\`\`

## 🎨 UI/UX Design Principles

- **Mobile-First**: Optimized for mobile devices with responsive design
- **Intuitive Navigation**: Bottom tab navigation for easy access
- **Visual Hierarchy**: Clear information architecture
- **Accessibility**: WCAG compliant with proper contrast and screen reader support
- **Brand Consistency**: Tech-focused color scheme (blues and indigos)

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control


### Demo Credentials
- **Email**: demo@techevents.com
- **Password**: demo123

## 📊 Database Schema (Planned)

### Users Table
\`\`\`sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    interests JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

### Events Table
\`\`\`sql
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    max_attendees INT NOT NULL,
    image_url VARCHAR(255),
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

### RSVPs Table
\`\`\`sql
CREATE TABLE rsvps (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    status ENUM('going', 'maybe', 'not_going') DEFAULT 'going',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_id, event_id)
);
\`\`\`

## 🔌 API Documentation

### Authentication Endpoints
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/logout\` - User logout
- \`GET /api/auth/me\` - Get current user

### Event Endpoints
- \`GET /api/events\` - Get all events
- \`GET /api/events/:id\` - Get specific event
- \`POST /api/events\` - Create new event (admin only)
- \`PUT /api/events/:id\` - Update event (admin only)
- \`DELETE /api/events/:id\` - Delete event (admin only)

### RSVP Endpoints
- \`POST /api/events/:id/rsvp\` - RSVP to event
- \`DELETE /api/events/:id/rsvp\` - Cancel RSVP
- \`GET /api/users/:id/events\` - Get user's events

### Comment Endpoints
- \`GET /api/events/:id/comments\` - Get event comments
- \`POST /api/events/:id/comments\` - Add comment
- \`DELETE /api/comments/:id\` - Delete comment

## 👥 Team Roles and Contributions

### Team Member 1: Frontend Developer
- **Responsibilities**: UI/UX implementation, React Native components, state management
- **Key Contributions**: Login/Registration screens, Event listing and details, Profile management
- **Technologies**: React Native, TypeScript, Tailwind CSS

### Team Member 2: Backend Developer
- **Responsibilities**: API development, database design, authentication system
- **Key Contributions**: RESTful API endpoints, JWT authentication, database schema
- **Technologies**: Node.js, Express.js, MySQL, JWT

### Team Member 3: Full-Stack Developer
- **Responsibilities**: Integration, real-time features, deployment
- **Key Contributions**: WebSocket implementation, API integration, app deployment
- **Technologies**: Socket.io, Firebase, Vercel/Heroku

### Team Member 4: QA & DevOps
- **Responsibilities**: Testing, CI/CD, documentation, project management
- **Key Contributions**: Unit testing setup, automated deployment pipeline, comprehensive documentation
- **Technologies**: Jest, GitHub Actions, Docker, AWS/Vercel

## 🧪 Testing Strategy

### Unit Testing
- Component testing with Jest and React Testing Library
- API endpoint testing with Supertest
- Authentication flow testing
- Database operation testing

### Integration Testing
- End-to-end user flows
- API integration testing
- Real-time feature testing
- Cross-platform compatibility testing

### Testing Commands
\`\`\`bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

## 🚀 Deployment

### Development Environment
- Local development server
- Hot reloading enabled
- Debug mode active

### Production Environment
- Vercel deployment for web version
- Expo/React Native CLI for mobile builds
- Environment variable configuration
- SSL certificate implementation

### Deployment Commands
\`\`\`bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Build mobile app
npx react-native run-android
npx react-native run-ios
\`\`\`

## 🔮 Future Enhancements

### Phase 2 Features
- **Push Notifications**: Event reminders and updates
- **Google Maps Integration**: Interactive event locations
- **Dark Mode**: Theme switching capability
- **Offline Mode**: SQLite local storage for offline access

### Phase 3 Features
- **Video Streaming**: Live event streaming
- **Payment Integration**: Paid event ticketing
- **Social Features**: Friend connections and messaging
- **Analytics Dashboard**: Event organizer insights

## 📚 References

### Technical Documentation
React Native Documentation. (2024). Getting Started Guide. Retrieved from https://reactnative.dev/docs/getting-started
 Firebase Documentation. (2024). Authentication Guide. Retrieved from https://firebase.google.com/docs/auth
 Express.js Documentation. (2024). API Reference. Retrieved from https://expressjs.com/en/api.html

### Design Resources
- Material Design Guidelines. (2024). Mobile Design Principles. Retrieved from https://material.io/design
- Apple Human Interface Guidelines. (2024). iOS App Architecture. Retrieved from https://developer.apple.com/design/human-interface-guidelines/

### Security Best Practices
- OWASP Mobile Security Project. (2024). Mobile Application Security. Retrieved from https://owasp.org/www-project-mobile-security/
- JWT.io. (2024). JSON Web Token Introduction. Retrieved from https://jwt.io/introduction/
