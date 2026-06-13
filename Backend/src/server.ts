import express from 'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
import type { Request, Response } from 'express';
import userRouter from "./routes/userRouter";
import projectRouter from "./routes/projectRouter";
import taskRouter from "./routes/taskRouter";
import teamRouter from "./routes/teamRouter";
import { prisma } from "./lib/prisma";
import cors from 'cors';
import { initSocket } from "./sockets";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  transports: ['websocket', 'polling'],
});
const port = 3000;

// Enable CORS for all routes
app.use(cors());


// Basic request logging (includes which API call was made + response status)
app.use((req: Request, res: Response, next) => {
  const apiCall = `${req.method} ${req.originalUrl}`;
  console.log(`Incoming request: ${apiCall}`);
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${apiCall} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
});

app.use(express.json());

// Health check endpoint that reports DB connectivity and the API call
app.get('/api/health', async (req: Request, res: Response) => {
  const apiCall = `${req.method} ${req.originalUrl}`;
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      apiCall,
      status: 'ok',
      db: 'connected',
    });
  } catch (error) {
    return res.status(503).json({
      apiCall,
      status: 'error',
      db: 'disconnected',
      error: (error as Error).message,
    });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});  

app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/teams", teamRouter);

// Initialize all Socket.IO event handlers
initSocket(io);


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
