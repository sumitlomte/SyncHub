# SyncHub

SyncHub is a full-stack project management and collaboration platform built to help teams organize work, manage tasks, assign responsibilities, and communicate in real time. It brings together project planning, task tracking, team collaboration, and live updates in a single app.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

SyncHub is designed for small teams and growing organizations that need a simple yet powerful way to manage their projects and collaborate effectively.

The platform includes:

- Project creation and organization
- Task assignment and tracking
- Team collaboration features
- Real-time messaging and updates
- Secure authentication and role-based access

## Features

- User registration and login
- JWT-based authentication
- Project management dashboard
- Task creation, editing, and status tracking
- Team member management
- Real-time chat and notifications with Socket.IO
- Prisma-powered database architecture
- Responsive frontend experience
- Type-safe code with TypeScript

## Technology Stack

### Frontend
- React
- Vite
- TypeScript
- TanStack Router
- TanStack Query
- Axios
- Material UI
- Socket.IO client

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT authentication
- AWS S3 integration

## Project Structure

```bash
SyncHub/
├── Backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── Frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── README.md
├── LICENSE
└── .gitignore
```

## Prerequisites

Before getting started, make sure you have:

- Node.js v18 or newer
- npm or yarn
- PostgreSQL installed and running
- Git
- VS Code or another code editor

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sumitlomte/SyncHub.git
cd SyncHub
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `Backend` folder:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/synchub"
JWT_SECRET="your_secret_key"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

Create a `.env.local` or `.env` file in the `Frontend` folder:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3001
```

### 5. Run Prisma migrations

```bash
cd Backend
npx prisma migrate dev
```

### 6. Start the app

Open two terminals.

Terminal 1:

```bash
cd Backend
npm run dev
```

Terminal 2:

```bash
cd Frontend
npm run dev
```

The application should now be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Configuration

### Backend configuration

- Update your PostgreSQL connection string in `.env`
- Keep your JWT secret secure and unique
- Ensure the backend port matches your environment

### Frontend configuration

- Confirm the API URL matches your backend server
- Confirm the Socket.IO URL points to your running WebSocket server

## Usage

### Example: Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

### Example: Create a project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Website Redesign",
    "description": "Improve the marketing site and user experience"
  }'
```

### Example: Frontend API call

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const response = await api.get('/projects');
console.log(response.data);
```

### Example: Socket.IO listener

```ts
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL);

socket.on('connect', () => {
  console.log('Connected to SyncHub realtime server');
});

socket.on('new_message', (message) => {
  console.log('New message received:', message);
});
```

## Contributing

Contributions are welcome and appreciated.

### How to contribute

1. Fork the repository
2. Create a new branch:

```bash
git checkout -b feature/my-improvement
```

3. Make your changes
4. Commit your work:

```bash
git commit -m "feat: add my improvement"
```

5. Push to your branch:

```bash
git push origin feature/my-improvement
```

6. Open a Pull Request

### Contribution guidelines

- Keep code clean and readable
- Follow the existing project conventions
- Write clear commit messages
- Add tests when possible
- Keep pull requests focused and easy to review

## License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2026 SyncHub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## Contact

If you have questions, suggestions, or would like to collaborate, please reach out:

- GitHub: https://github.com/sumitlomte/SyncHub
- Email: sumitlomte348@gmail.com
- LinkedIn: https://linkedin.com/in/sumit-lomte-79891a243
  
You can also open an issue in the repository for bugs or feature requests.

---

Thank you for checking out SyncHub. Contributions and feedback are always welcome.

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
