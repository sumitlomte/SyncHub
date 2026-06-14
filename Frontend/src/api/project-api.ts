import api from "./axios";
import type { UpdateProject, CreateProject } from "../types/project";

export const fetchAllProjectsByUserID = async (userId: string) => {
    const response = await api.get(`/projects/getAllProjectByUserID/${userId}`);
    return response.data;
};

export const fetchProject = async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
}

export const createProject = async (projectData: CreateProject) => {
    const { title, description, userId } = projectData;
    const response = await api.post(`/projects`, {
        title,
        description,
        userId
    });
    return response.data;
};

export const updateProject = async (projectData: UpdateProject) => {
    const { id, title, description } = projectData;
    const response = await api.put(`/projects/${id}`, {
        title: title,
        description: description
    });
    return response.data;
}

export const deleteProject = async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
}

export const getAllProjectsList = async (userId: string) => {
    const response = await api.get(`/projects/getAllProjectsList/${userId}`);
    return response.data;
}