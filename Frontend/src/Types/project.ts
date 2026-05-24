export interface Project {
    id: string;
    userId: string; 
    title: string;
    description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  email?: string; 
}

export interface ProjectItem extends Project {
  teamMembers: TeamMember[];
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
