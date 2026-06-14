import api from "./axios";
import type { Task, CreateTask, UpdateTask } from "../types/task";

export const getTasksByProjectId = async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/tasks/getTasksByProjectId/${projectId}`);
    return response.data;
}

export const getTaskById = async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
}

export const createTask = async (task: CreateTask): Promise<Task> => {
    const response = await api.post("/tasks", task);
    return response.data;
}

export const updateTask = async (id: string, task: UpdateTask): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
}

export const deleteTask = async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
}
