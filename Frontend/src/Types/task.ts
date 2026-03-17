export interface Task { 
    id: string;
    title: string;  
    description: string;
    projectId: string; 
    createdAt: Date;
    assignee: string;
    assignedTo: string;
    updatedAt: Date;
    status: "TODO"| "IN_PROGRESS" | "COMPLETED";
    dueDate: Date; 
}   

export interface CreateTask {
    title: string;
    description: string;
    projectId: string;
    assignee: string; //userId of assignee
    assignedTo: string; //userId of assigned user
    // dueDate: Date; 
}

export interface UpdateTask {
    id: string;
    title: string;
    description: string;
    projectId: string;
    assignee: string;
    assignedTo: string; //userId of assigned user
    status: "TODO"| "IN_PROGRESS" | "COMPLETED";
    dueDate: Date; 
}