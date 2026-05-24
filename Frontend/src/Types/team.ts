export interface Team {
    id: string;
    name: string;
    description: string;
    members: string[]; // Array of user IDs
    projectId: string; // ID of the associated project
}

export interface AddRemoveTeamMember {
    productId: string;
    userIds: string[];
}

