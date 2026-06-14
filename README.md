# SyncHub - Project Management & Team Collaboration Platform

SyncHub is a full-stack web application designed for managing projects, tasks, and team collaboration. It enables users to organize work, assign tasks, and collaborate with team members in real-time through WebSocket-powered messaging and live updates.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [WebSocket Events](#-websocket-events)
- [Development](#-development)
- [Authentication & Security](#-authentication--security)
- [Deployment](#-deployment)
- [Database Schema](#-database-schema)
- [Troubleshooting](#-troubleshooting)
- [Support & Resources](#-support--resources)
- [License](#-license)

## ✨ Features

- **User Management**: Registration, authentication with JWT, role-based access (USER, ADMIN), profile management
- **Project Management**: Create, update, and manage projects with descriptions and team collaboration
- **Task Management**: Create tasks, assign to team members, track status (TODO, IN_PROGRESS, COMPLETED), set priorities
- **Team Collaboration**: Add team members to projects, assign tasks to collaborators, view team member profiles
- **Real-time Messaging**: WebSocket-powered chat system for project conversations
- **Real-time Updates**: Live collaboration with instant updates across all connected clients
- **Secure Authentication**: JWT-based authorization and middleware protection
- **Message History**: Persistent message storage with full conversation history
- **Status Tracking**: Real-time visibility into project and task progress

## 🛠 Tech Stack

### Backend
- **Node.js** (v18+) with **Express.js** - REST API server
- **Prisma ORM** - Database management and migrations
- **PostgreSQL** - Relational database
- **Socket.io** - Real-time WebSocket communication
- **JWT** - Authentication & authorization
- **TypeScript** - Type-safe development
- **CORS** - Cross-origin resource sharing
- **Middleware**: Custom authentication middleware, CORS, request logging

### Frontend
- **React 19** - UI framework with hooks
- **Vite** - Modern build tool & dev server
- **TanStack Router** - Type-safe client-side routing
- **TanStack React Query** - Server state management and caching
- **Axios** - HTTP client with interceptors
- **Material-UI (MUI)** - Enterprise UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **TypeScript** - Type-safe development
- **ESLint & Prettier** - Code quality and formatting

## 📁 Project Structure

```
SyncHub/
├── Backend/
│   ├── src/
│   │   ├── server.ts                 # Express server entry point
│   │   ├── controllers/              # Request handlers
│   │   │   ├── projectController.ts  # Project operations
│   │   │   ├── taskController.ts     # Task operations
│   │   │   ├── teamController.ts     # Team management
│   │   │   ├── userController.ts     # User authentication & profile
│   │   │   └── messageController.ts  # Message operations
│   │   ├── routes/                   # API route definitions
│   │   │   ├── projectRouter.ts
│   │   │   ├── taskRouter.ts
│   │   │   ├── teamRouter.ts
│   │   │   ├── userRouter.ts
│   │   │   └── messageRouter.ts
│   │   ├── middleware/               # Express middleware
│   │   │   └── authenMiddleware.ts   # JWT authentication
│   │   ├── sockets/                  # WebSocket handlers
│   │   │   ├── index.ts             # Socket.io setup
│   │   │   ├── handlers/            # Event handlers
│   │   │   ├── middleware/          # Socket middleware
│   │   │   └── services/            # Socket business logic
│   │   ├── lib/
│   │   │   └── prisma.ts            # Prisma client singleton
│   │   ├── types/                    # TypeScript type definitions
│   │   │   └── types.ts
│   │   └── utils/                    # Helper functions
│   │       └── authHelper.ts
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema definition
│   │   └── migrations/              # Database migration history
│   ├── generated/                    # Prisma generated types
│   │   └── prisma/                  # Prisma client types
│   ├── package.json
│   ├── tsconfig.json
│   └── prisma.config.ts
│
└── Frontend/
    ├── src/
    │   ├── main.tsx                 # React app entry point
    │   ├── router.ts                # TanStack Router configuration
    │   ├── Socket.ts                # WebSocket client setup
    │   ├── routes/                  # Route components
    │   │   ├── __root.tsx
    │   │   ├── login.tsx
    │   │   ├── projects.tsx
    │   │   ├── projects.$projectId.tsx
    │   │   ├── tasks.tsx
    │   │   ├── users.tsx
    │   │   └── users.$userId.tsx
    │   ├── components/              # React components
    │   │   ├── common/              # Shared components
    │   │   ├── features/            # Feature-specific components
    │   │   ├── ui/                  # UI primitives
    │   │   ├── Modals/              # Modal dialogs
    │   │   ├── pages/               # Page components
    │   │   ├── SideNav.tsx
    │   │   ├── ProjectList.tsx
    │   │   ├── ProjectConversation.tsx
    │   │   ├── UserList.tsx
    │   │   └── AssignedProjects.tsx
    │   ├── api/                     # API service layer
    │   │   ├── axios.ts             # Axios instance with interceptors
    │   │   ├── user-api.ts
    │   │   ├── project-api.ts
    │   │   ├── task-api.ts
    │   │   ├── team-api.ts
    │   │   └── message-api.ts
    │   ├── hooks/                   # Custom React hooks
    │   │   ├── use-user.ts
    │   │   ├── use-project.ts
    │   │   ├── use-task.ts
    │   │   ├── use-team.ts
    │   │   ├── use-message.ts
    │   │   ├── use-error-handler.ts
    │   │   └── use-form-validation.ts
    │   ├── store/                   # State management
    │   │   └── Auth-store.ts        # Authentication state
    │   ├── types/                   # TypeScript types
    │   │   ├── user.ts
    │   │   ├── project.ts
    │   │   ├── task.ts
    │   │   └── team.ts
    │   ├── utils/                   # Utility functions
    │   │   ├── auth-guard.ts        # Route protection
    │   │   ├── logger.ts            # Logging utility
    │   │   ├── message.ts           # Message utilities
    │   │   ├── toast.ts             # Toast notifications
    │   │   ├── validation.ts        # Form validation
    │   │   └── sanitize.ts          # Input sanitization
    │   └── App.css                  # Global styles
    ├── public/                       # Static assets
    ├── vite.config.ts               # Vite configuration
    ├── tsconfig.json                # TypeScript configuration
    ├── eslint.config.js             # ESLint configuration
    └── package.json
```

## 📦 Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9+) or **yarn** package manager
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### Optional
- **Docker** - For containerized deployment
- **Postman** - For API testing

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd SyncHub

# 2. Setup Backend
cd Backend
npm install
cp .env.example .env  # Configure your environment variables
npx prisma migrate dev

# 3. Setup Frontend
cd ../Frontend
npm install

# 4. Run in separate terminals
# Terminal 1 - Backend
cd Backend && npm run dev

# Terminal 2 - Frontend
cd Frontend && npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SyncHub
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

## ⚙️ Configuration

### Backend Setup

1. **Create `.env` file in Backend directory**

```bash
cd Backend
cp .env.example .env
```

2. **Add environment variables**

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/synchub"

# JWT Configuration
JWT_SECRET="your-super-secret-key-generate-with-crypto"
JWT_EXPIRY="7d"

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:5173"

# Socket.io Configuration
SOCKET_PORT=3001
SOCKET_CORS_ORIGIN="http://localhost:5173"

# Optional: Email notifications
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
```

**Replace values:**
- `user` and `password` - Your PostgreSQL credentials
- `localhost:5432` - Your database host and port
- `synchub` - Your database name
- `your-super-secret-key-generate-with-crypto` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Frontend Setup

1. **Create `.env.local` file in Frontend directory (optional)**

```bash
cd Frontend
cp .env.example .env.local
```

2. **Configure API and Socket endpoints**

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3001

# Optional: Environment flag
VITE_ENV=development
```

### Environment Variables Reference

| Variable | Backend | Frontend | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | ✓ | | PostgreSQL connection string |
| `JWT_SECRET` | ✓ | | Secret key for JWT token signing |
| `JWT_EXPIRY` | ✓ | | JWT token expiration time |
| `PORT` | ✓ | | Backend API server port |
| `CORS_ORIGIN` | ✓ | | Frontend URL for CORS |
| `SOCKET_PORT` | ✓ | | WebSocket server port |
| `VITE_API_URL` | | ✓ | Backend API base URL |
| `VITE_SOCKET_URL` | | ✓ | WebSocket server URL |

## 🗄 Database Setup

### 1. Create PostgreSQL Database

```bash
# Using PostgreSQL CLI
createdb synchub

# Or using psql
psql -U postgres -c "CREATE DATABASE synchub;"
```

### 2. Run Prisma Migrations

```bash
cd Backend

# Run migrations
npx prisma migrate dev --name init

# Or reset database (⚠️ deletes all data)
npx prisma migrate reset
```

This will:
- Create all tables defined in `schema.prisma`
- Generate Prisma Client with types
- Seed initial data (if configured)
- Update the `_prisma_migrations` table

### 3. Verify Database Setup

```bash
# View and manage database records in Prisma Studio
npx prisma studio

# Or test connection
npx prisma db execute --stdin < /dev/null && echo "✓ Connection successful"
```

### 4. Database Models

- **User** - Application users with roles and credentials
- **Project** - Project management with owners and team members
- **Task** - Tasks within projects with status and assignments
- **TeamMember** - Relationships between users and projects
- **Message** - Project conversations and history

## 📡 Running the Application

### Development Mode

**Terminal 1 - Backend Server**

```bash
cd Backend
npm run dev
```

- Server runs at `http://localhost:3000`
- API endpoints accessible at `http://localhost:3000/api`
- WebSocket available at `http://localhost:3001`
- Hot reload enabled with TypeScript compilation

**Terminal 2 - Frontend Dev Server**

```bash
cd Frontend
npm run dev
```

- Frontend runs at `http://localhost:5173` (or next available port)
- HMR (Hot Module Replacement) enabled for instant updates
- CSS and TypeScript compiled in real-time

### Production Build

**Backend**

```bash
cd Backend

# Build TypeScript
npm run build

# Start production server
npm start

# Or run directly
node dist/server.js
```

**Frontend**

```bash
cd Frontend

# Build for production
npm run build

# Preview production build locally
npm run preview

# Artifacts in dist/ folder ready for deployment
```

### Using Docker (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3000
# - WebSocket: http://localhost:3001
```

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user, receive JWT token
- `POST /api/users/logout` - Logout user
- `POST /api/users/refresh` - Refresh expired JWT token

### Users
- `GET /api/users` - List all users (paginated)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account
- `GET /api/users/search?q=query` - Search users

### Projects
- `POST /api/projects` - Create new project (requires auth)
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/members` - Get project team members

### Tasks
- `POST /api/tasks` - Create task in project
- `GET /api/tasks` - List all tasks
- `GET /api/tasks?projectId=:id` - List tasks in project
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task (status, assignee, etc.)
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status only

### Team Management
- `POST /api/teams/members` - Add team member to project
- `GET /api/teams/:projectId/members` - List project team members
- `DELETE /api/teams/members/:id` - Remove team member from project

### Messages
- `GET /api/messages/:projectId` - Get project chat history
- `POST /api/messages` - Send message (also via WebSocket)
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

### Health & Status
- `GET /api/health` - Server status
- `GET /api/health/db` - Database connectivity check

### Request Headers
All authenticated endpoints require:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## � WebSocket Events

The application uses Socket.io for real-time communication. Connect to `http://localhost:3001` (development) or your production WebSocket URL.

### Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client → Server Events

#### Messages
- `send_message` - Send message to project
  ```javascript
  socket.emit('send_message', { projectId, content, userId })
  ```
- `edit_message` - Edit existing message
- `delete_message` - Delete message

#### Project Events
- `join_project` - Join project room
- `leave_project` - Leave project room
- `project_updated` - Project details changed

#### Task Events
- `task_created` - New task created
- `task_updated` - Task status or details changed
- `task_deleted` - Task removed

### Server → Client Events

#### Message Events
- `new_message` - Receive new message
- `message_edited` - Existing message was edited
- `message_deleted` - Message was deleted
- `message_history` - Initial message history

#### Project Events
- `project_update` - Project was updated
- `team_member_joined` - User joined project
- `team_member_left` - User left project

#### Real-time Updates
- `task_update` - Task status changed
- `user_online` - User came online
- `user_offline` - User went offline

### Example Usage

```javascript
// Listen for new messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
  // Update UI with new message
});

// Send message
socket.emit('send_message', {
  projectId: '123',
  content: 'Hello team!',
  userId: 'user-456'
});

// Join project room
socket.emit('join_project', { projectId: '123' });
```

## 💻 Development

### Available Scripts

#### Backend

```bash
npm run dev              # Start dev server with hot reload (ts-node + nodemon)
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production build
npm run format           # Format code with Prettier
npm run format:watch     # Watch and auto-format on file changes
npm run lint             # Run ESLint checks
npm run type-check       # Run TypeScript type checking
```

#### Frontend

```bash
npm run dev              # Start Vite dev server (port 5173)
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
npm run format           # Format code with Prettier
```

### Development Tools

#### Prisma
```bash
cd Backend

# Open Prisma Studio (visual database browser)
npx prisma studio

# Generate Prisma Client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

#### Testing
```bash
# Backend testing (when implemented)
npm run test
npm run test:watch

# Frontend testing
npm run test:unit
npm run test:e2e
```

### Code Organization

#### Backend
- **Controllers** - Handle HTTP requests and business logic
- **Routes** - Define API endpoints
- **Services** - Reusable business logic
- **Middleware** - Authentication, logging, error handling
- **Types** - TypeScript type definitions
- **Utils** - Helper functions

#### Frontend
- **Routes** - Page components with TanStack Router
- **Components** - Reusable React components
- **Hooks** - Custom React hooks
- **API** - Service layer for API calls
- **Store** - State management (Zustand/Context)
- **Types** - TypeScript interfaces
- **Utils** - Helper functions

### Debugging

#### Backend
```bash
# Run with debugging enabled
node --inspect-brk=9229 dist/server.js

# Or with ts-node
ts-node --inspect-brk=9229 src/server.ts
```

Then attach debugger in VS Code: F5 → Node.js

#### Frontend
- Use browser DevTools (F12)
- React DevTools browser extension
- Network tab for API calls
- Console tab for errors

#### Database
```bash
# View logs
npx prisma studio

# Check migrations
npx prisma migrate status

# Validate schema
npx prisma validate
```

### Best Practices

- **Type Safety** - Use TypeScript everywhere, enable strict mode
- **Error Handling** - Always catch and handle errors appropriately
- **Logging** - Use structured logging for debugging
- **Authentication** - Always verify JWT tokens on protected routes
- **Validation** - Validate user input on both frontend and backend
- **Performance** - Use React Query for caching, implement pagination
- **Security** - Sanitize inputs, use HTTPS in production
- **Code Quality** - Use ESLint and Prettier, run type checks
- **Testing** - Write unit and integration tests
- **Documentation** - Document complex logic and API changes

### Useful Tools

**Prisma Studio** - Visual database browser

```bash
cd Backend
npx prisma studio
```

**Generate Prisma Client** - After schema changes

```bash
cd Backend
npx prisma generate
```

### Database Migrations

**Create a new migration**

```bash
cd Backend
npx prisma migrate dev --name <migration-name>
```

**Reset database** (⚠️ deletes all data)

```bash
cd Backend
npx prisma migrate reset
```

## 🔐 Authentication & Security

### JWT Authentication
- **Implementation**: JWT (JSON Web Tokens) stored in localStorage
- **Validation**: `authenMiddleware.ts` validates all protected routes
- **Token Format**: `Bearer <jwt_token>` in Authorization header
- **Expiration**: Configurable token lifespan (default: 7 days)
- **Refresh**: Implement token refresh endpoint for long sessions

### User Roles & Permissions
- **USER** (default) - Can create projects, manage own content
- **ADMIN** - Can manage all users and projects
- **Roles** enforced at controller and database levels

### Security Best Practices
- Hash passwords with bcrypt (implement in userController)
- Store JWT_SECRET securely in environment variables
- Use HTTPS in production
- Implement CORS properly - whitelist frontend URLs
- Validate and sanitize all user inputs
- Use rate limiting on authentication endpoints
- Implement CSRF protection for state-changing operations

### Frontend Authentication
```typescript
// Token management in Auth-store.ts
- Store JWT in localStorage (can migrate to secure cookie)
- Include token in all API requests via Axios interceptor
- Clear token on logout
- Redirect to login on 401 response
```

## 🚀 Deployment

### Backend Deployment Options

#### Heroku
```bash
# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET="your-secret"
heroku config:set DATABASE_URL="your-postgresql-url"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Railway / Render
1. Connect GitHub repository
2. Create new service
3. Set environment variables
4. Deploy automatically on push

#### AWS / Google Cloud
1. Build Docker image: `docker build -t synchub-backend .`
2. Push to container registry
3. Deploy to ECS/Cloud Run
4. Setup PostgreSQL (AWS RDS / Cloud SQL)

#### Docker
```bash
# Build image
docker build -t synchub-backend:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  synchub-backend:latest
```

### Frontend Deployment Options

#### Vercel (Recommended for React)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in dashboard
VITE_API_URL=https://your-backend.com
VITE_SOCKET_URL=https://your-socket-server.com
```

#### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set build environment variables

#### AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Traditional Hosting (Apache, Nginx)
```bash
# Build
npm run build

# Copy dist folder to web server
scp -r dist/* user@server:/var/www/html/synchub/

# Configure nginx
location / {
  root /var/www/html/synchub;
  try_files $uri /index.html;
}
```

### Database Deployment

#### Managed Services (Recommended)
- **Railway** - Integrated PostgreSQL
- **AWS RDS** - Managed PostgreSQL
- **Heroku Postgres** - Integrated database
- **Prisma Data Platform** - Query optimization

#### Self-Hosted PostgreSQL
```bash
# Digital Ocean / Linode
1. Create managed database
2. Run migrations: npx prisma migrate deploy
3. Setup backups and monitoring
```

### Production Checklist

- [ ] Environment variables configured securely
- [ ] HTTPS enabled on all endpoints
- [ ] CORS configured for production URL only
- [ ] JWT_SECRET is strong and unique
- [ ] Database backups enabled
- [ ] Error logging setup (Sentry, LogRocket)
- [ ] Performance monitoring (New Relic, DataDog)
- [ ] Frontend build optimized (code splitting, lazy loading)
- [ ] API rate limiting enabled
- [ ] Security headers configured (CSP, HSTS)
- [ ] SSL certificates valid and renewed
- [ ] Database indexes optimized
- [ ] CDN configured for static assets
- [ ] Email/notification system configured
- [ ] Monitoring and alerts setup

### Environment Variables for Production

```env
# Backend
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://prod-user:secure-password@prod-db.com:5432/synchub"
JWT_SECRET="very-long-random-secret-key"
JWT_EXPIRY="7d"
CORS_ORIGIN="https://yourdomain.com"
SOCKET_CORS_ORIGIN="https://yourdomain.com"

# Frontend
VITE_API_URL="https://api.yourdomain.com"
VITE_SOCKET_URL="https://socket.yourdomain.com"
VITE_ENV="production"
```

## 📝 Database Schema

### Core Models

#### User
```
- id: String (UUID)
- email: String (unique)
- password: String (hashed)
- firstName: String
- lastName: String
- role: Role (USER | ADMIN)
- createdAt: DateTime
- updatedAt: DateTime
- projects: Project[] (one-to-many)
- tasks: Task[] (one-to-many)
- teamMembers: TeamMember[] (one-to-many)
- messages: Message[] (one-to-many)
```

#### Project
```
- id: String (UUID)
- name: String
- description: String
- ownerId: String (foreign key)
- owner: User (many-to-one)
- tasks: Task[] (one-to-many)
- teamMembers: TeamMember[] (one-to-many)
- messages: Message[] (one-to-many)
- createdAt: DateTime
- updatedAt: DateTime
```

#### Task
```
- id: String (UUID)
- title: String
- description: String
- status: TaskStatus (TODO | IN_PROGRESS | COMPLETED)
- projectId: String (foreign key)
- project: Project (many-to-one)
- assignedUserId: String (foreign key, optional)
- assignedUser: User (many-to-one)
- createdBy: User (many-to-one)
- createdAt: DateTime
- updatedAt: DateTime
```

#### TeamMember
```
- id: String (UUID)
- userId: String (foreign key)
- user: User (many-to-one)
- projectId: String (foreign key)
- project: Project (many-to-one)
- role: String (optional, e.g., "member", "lead")
- joinedAt: DateTime
```

#### Message
```
- id: String (UUID)
- content: String
- projectId: String (foreign key)
- project: Project (many-to-one)
- userId: String (foreign key)
- user: User (many-to-one)
- createdAt: DateTime
- updatedAt: DateTime
- deletedAt: DateTime (soft delete)
```

### Enums

- **Role**: USER, ADMIN
- **TaskStatus**: TODO, IN_PROGRESS, COMPLETED

See [Backend/prisma/schema.prisma](Backend/prisma/schema.prisma) for complete schema details.

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
cd Backend
npx prisma db push

# Check connection string
echo $DATABASE_URL

# Verify PostgreSQL service is running
# Windows: services.msc → PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql
```

**Solutions:**
- Ensure DATABASE_URL is correct in `.env`
- Verify PostgreSQL server is running
- Check username/password in connection string
- Confirm database exists
- Check firewall rules for port 5432

### Port Already in Use

```bash
# Find process using port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Or change port in config files
Backend/src/server.ts → PORT
Frontend/vite.config.ts → server.middlewareMode
```

### Missing Environment Variables

```bash
# Backend
cp .env.example .env
# Add required values

# Frontend
cp .env.example .env.local
# Add VITE_* variables
```

**Required Backend Variables:**
- DATABASE_URL
- JWT_SECRET
- PORT

**Required Frontend Variables:**
- VITE_API_URL
- VITE_SOCKET_URL

### npm Install Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# For yarn
yarn cache clean
rm -rf node_modules yarn.lock
yarn install
```

### TypeScript Errors

```bash
# Backend
cd Backend
npx tsc --noEmit

# Frontend
cd Frontend
npm run type-check

# Fix issues
npm run format        # Fix formatting
npm run lint:fix      # Fix lint errors
```

### Build Errors

```bash
# Backend
npm run build
# Check dist/ folder was created

# Frontend
npm run build
# Check dist/ folder was created
# Ensure all imports are correct
```

### WebSocket Connection Issues

**Check connectivity:**
```bash
# From browser console
const socket = io('http://localhost:3001', { reconnection: true });
socket.on('connect', () => console.log('Connected'));
socket.on('connect_error', (error) => console.log('Error:', error));
```

**Solutions:**
- Verify SOCKET_URL is correct in frontend `.env`
- Check Socket.io server is running on backend
- Verify CORS_ORIGIN is configured correctly
- Check firewall allows WebSocket connections

### Frontend Not Connecting to Backend

```bash
# Check API URL
# Frontend console
console.log(import.meta.env.VITE_API_URL)

# Test API connection
curl http://localhost:3000/api/health

# Check CORS headers
# Look for Access-Control-Allow-Origin in response
```

### Authentication Issues

```bash
# Token not persisting
- Check localStorage in DevTools
- Verify Auth-store.ts is working
- Check JWT_SECRET matches between sessions

# 401 Unauthorized errors
- Verify token is being sent in headers
- Check token hasn't expired
- Verify JWT_SECRET is correct on backend

# Role-based access denied
- Confirm user role in database
- Check role validation in controllers
- Verify JWT payload includes role
```

### Performance Issues

```bash
# Slow database queries
npx prisma studio     # Check query execution
# Add indexes to frequently queried fields
# Use SELECT to fetch only needed columns

# Large bundle size
npm run build
# Analyze with: npm install webpack-bundle-analyzer

# Frontend lag
# Check DevTools Performance tab
# Enable React.StrictMode to find issues
# Use React Profiler
```

### Still Having Issues?

1. **Check logs**
   ```bash
   # Backend
   npm run dev        # View console output
   
   # Frontend
   npm run dev        # Check terminal
   # Browser console (F12)
   ```

2. **Enable debug logging**
   ```bash
   # Backend
   DEBUG=* npm run dev
   
   # Frontend
   localStorage.debug = '*'
   ```

3. **Check GitHub Issues** - Search for similar problems

4. **Get detailed error info**
   - Copy full error message
   - Note steps to reproduce
   - Include environment details (OS, Node version, etc.)

5. **Ask for help**
   - Open GitHub issue with details
   - Include error logs and screenshots
   - Describe what you've already tried

## 📞 Support & Resources

### Getting Help

- **Documentation**: Read the sections above for detailed guides
- **Issues**: Search [GitHub Issues](https://github.com/sumitlomte/SyncHub/issues) for similar problems
- **Discussions**: Join discussions for feature requests and ideas
- **Email**: Contact maintainers at [sumitlomte348@gmail.com]

### Useful Resources

- **Prisma Documentation**: https://www.prisma.io/docs/
- **Express.js Guide**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **Vite Guide**: https://vitejs.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Socket.io Documentation**: https://socket.io/docs/

### Community

- Follow updates and announcements
- Share feedback and feature requests
- Help other users troubleshoot
- Contribute improvements

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

### What this means:
- ✅ You can use this project for commercial and private purposes
- ✅ You can modify and distribute the code
- ✅ You must include the license and copyright notice
- ❌ The software is provided "as is" without warranty

---

## 🎉 Getting Started

Ready to dive in? Follow these steps:

1. **Clone & Setup**: [Installation](#-installation)
2. **Configure**: [Configuration](#-configuration)
3. **Run Locally**: [Running the Application](#-running-the-application)
4. **Explore**: Check out the [API Endpoints](#-api-endpoints)
5. **Develop**: See [Development](#-development) for best practices
6. **Deploy**: [Deployment](#-deployment) guide

**Happy collaborating with SyncHub! 🚀**
