export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface RegisterUser extends User {
  password: string;
}

export interface UpdateUser extends User {
  id: string;
  password?: string | null;
}
export interface LoginUser {
    email: string;
    password: string;
}

export interface AssignedProjects {
  id: string;
  title: string;
  description: string;
  userId: string;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}