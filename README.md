# SyncHub - Project Management & Team Collaboration Platform

SyncHub is a full-stack web application designed for managing projects, tasks, and team collaboration. It enables users to organize work, assign tasks, and collaborate with team members in real-time.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)

## ✨ Features

- **User Management**: Registration, authentication with JWT, role-based access (USER, ADMIN)
- **Project Management**: Create, update, and manage projects with descriptions
- **Task Management**: Create tasks, assign to team members, track status (TODO, IN_PROGRESS, COMPLETED)
- **Team Collaboration**: Add team members to projects, assign tasks to collaborators
- **Real-time Updates**: WebSocket support for live collaboration (sockets implementation)
- **Secure Authentication**: JWT-based authorization and middleware protection

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js** - REST API server
- **Prisma** - ORM for database management
- **PostgreSQL** - Primary database
- **JWT** - Authentication & authorization
- **TypeScript** - Type-safe development
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **TanStack Router** - Client-side routing
- **TanStack React Query** - Server state management
- **Axios** - HTTP client
- **Material-UI (MUI)** - UI component library
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe development

## 📁 Project Structure

```
SyncHub/
├── Backend/
│   ├── src/
│   │   ├── server.ts                 # Express server entry point
│   │   ├── controllers/              # Route handlers
│   │   │   ├── projectController.ts
│   │   │   ├── taskController.ts
│   │   │   ├── teamController.ts
│   │   │   └── userController.ts
│   │   ├── routes/                   # API routes
│   │   ├── middleware/               # Express middleware
│   │   │   └── authenMiddleware.ts
│   │   ├── lib/
│   │   │   └── prisma.ts            # Prisma client
│   │   ├── types/                    # TypeScript types
│   │   └── utils/                    # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # Database migrations
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── main.tsx                 # App entry point
    │   ├── App.tsx                  # Root component
    │   ├── routes/                  # Route components
    │   ├── components/              # React components
    │   ├── api/                     # API service layer
    │   ├── hooks/                   # Custom React hooks
    │   ├── store/                   # State management
    │   ├── Types/                   # TypeScript types
    │   └── styles/                  # Styling
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

## 📦 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud-hosted)
- **Git**

## 🚀 Installation

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
touch .env
```

2. **Add environment variables**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/synchub"

# JWT
JWT_SECRET="your-secret-key-here"

# Server
PORT=3000
NODE_ENV=development
```

Replace:
- `user` and `password` with your PostgreSQL credentials
- `localhost:5432` with your database host and port
- `synchub` with your desired database name
- `your-secret-key-here` with a secure random string

### Frontend Setup

1. **Create `.env` file in Frontend directory (optional)**

```bash
cd Frontend
touch .env.local
```

2. **Configure API endpoint** (if needed)

```env
VITE_API_URL=http://localhost:3000/api
```

## 🗄 Database Setup

### 1. Create PostgreSQL Database

```bash
# Using PostgreSQL CLI
createdb synchub
```

### 2. Run Prisma Migrations

```bash
cd Backend
npx prisma migrate dev --name init
```

This will:
- Create all tables defined in `schema.prisma`
- Generate Prisma Client
- Seed initial data (if seed scripts exist)

### 3. Verify Database Setup

```bash
npx prisma studio
```

This opens Prisma Studio in your browser to view/manage database records.

## 📡 Running the Application

### Development Mode

**Terminal 1 - Backend Server**

```bash
cd Backend
npm run dev
```

The server will start at `http://localhost:3000`

**Terminal 2 - Frontend Dev Server**

```bash
cd Frontend
npm run dev
```

The frontend will start at `http://localhost:5173` (or next available port)

### Production Build

**Backend**

```bash
cd Backend
npm run build
npm start
```

**Frontend**

```bash
cd Frontend
npm run build
npm run preview
```

## 📚 API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user profile
- `GET /api/users` - List all users

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `POST /api/tasks` - Create a task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task (status, assignee, etc.)
- `DELETE /api/tasks/:id` - Delete task

### Teams
- `POST /api/teams/members` - Add team member to project
- `GET /api/teams/:projectId/members` - List project team members
- `DELETE /api/teams/members/:id` - Remove team member

### Health Check
- `GET /api/health` - Server status and database connectivity

## 💻 Development

### Available Scripts

#### Backend

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm start                # Run production build
npm run format           # Format code with Prettier
npm run format:watch     # Watch and auto-format on file changes
```

#### Frontend

```bash
npm run dev              # Start Vite development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run preview          # Preview production build locally
```

### Useful Tools

**Prisma Studio** - Visual database explorer

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

## 🔐 Authentication

- User authentication uses **JWT (JSON Web Tokens)**
- JWT tokens are validated via `authenMiddleware.ts`
- Tokens should be sent in the `Authorization` header: `Bearer <token>`
- Roles: `USER` (default), `ADMIN`

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📝 Database Schema

### Models

- **User** - Application users with roles and authentication
- **Project** - Projects owned by users
- **Task** - Tasks within projects with status tracking
- **TeamMember** - Links users to projects as team members

### Enums

- **Role**: USER, ADMIN
- **TaskStatus**: TODO, IN_PROGRESS, COMPLETED

See `Backend/prisma/schema.prisma` for full schema details.

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connectivity
cd Backend
npx prisma db push

# Check DATABASE_URL in .env file
# Ensure PostgreSQL service is running
```

### Port Already in Use

```bash
# Change port in Backend/src/server.ts or Frontend/vite.config.ts
# Or kill existing process on port
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

### Missing Environment Variables

Ensure `.env` files are created in both Backend and Frontend directories with required variables.

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Happy collaborating with SyncHub!** 🎉
