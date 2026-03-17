export interface Project {
    id: string;
    userId: string; 
    title: string;
    description: string;
}

export interface CreateProject {
    title: string;
    description: string;
    userId: string;
}

export interface UpdateProject {    
    id: string;
    title: string;
    description: string;
}
