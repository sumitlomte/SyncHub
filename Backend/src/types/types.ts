export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "USER";
}

export interface Project {
    id: string;
    title: string;
    description: string;
    userId: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    projectId: string;
    createdAt : Date;
    assignee: string;
    assignedTo: string;
    assignedUserId: string;
    updatedAt: Date;
    status: "TODO" | "IN_PROGRESS" | "COMPLETED";
    dueDate: Date;
}