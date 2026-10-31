import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import type { ApiErrorDTO } from "../dto/common.dto";
import type {
    CreateTaskRequestDTO,
    TaskDTO,
    UpdateTaskRequestDTO,
} from "../dto/task.dto";

type TaskRecord = NonNullable<Awaited<ReturnType<typeof prisma.task.findUnique>>>;

const toTaskDTO = (task: TaskRecord): TaskDTO => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    dueDate: task.dueDate?.toISOString() ?? null,
});

export const createTask = async (
    req: Request<Record<string, never>, TaskDTO | ApiErrorDTO, CreateTaskRequestDTO>,
    res: Response<TaskDTO | ApiErrorDTO>,
) => {
    try {
        const { title, description, projectId, assignee, assignedTo } = req.body;
        const assigneeUser = await prisma.user.findUnique({
            where: { id: String(assignee) },
        }) || { name: "Unassigned" };

        const assignedToUser = await prisma.user.findUnique({
            where: { id: String(assignedTo) },
        }) || { name: "Unassigned" };

        const task = await prisma.task.create({
            data: {
                title,
                description,
                projectId,
                assignee: assigneeUser.name ,
                assignedTo: assignedToUser.name,
                assignedUserId: assignedTo,
            },
        });
        res.status(201).json(toTaskDTO(task));
    } catch (error) {    
        res.status(500).json({ error: "Failed to create task" });
    }
};

export const getTasksByProjectId = async (
    req: Request<{ projectId: string }, TaskDTO[] | ApiErrorDTO>,
    res: Response<TaskDTO[] | ApiErrorDTO>,
) => {
    try {
        const { projectId } = req.params;
        const tasks = await prisma.task.findMany({
            where: { projectId: String(projectId) },
        });
        res.status(200).json(tasks.map(toTaskDTO));
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
};

export const getTaskById = async (
    req: Request<{ id: string }, TaskDTO | ApiErrorDTO>,
    res: Response<TaskDTO | ApiErrorDTO>,
) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id: String(id) },
        });
        if (task) {
            res.status(200).json(toTaskDTO(task));
        }
        else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve task" });
    }
};

export const updateTask = async (
    req: Request<{ id: string }, TaskDTO | ApiErrorDTO, UpdateTaskRequestDTO>,
    res: Response<TaskDTO | ApiErrorDTO>,
) => {
    try {
        const { id } = req.params;
        const { title, description, assignee, assignedTo, status, dueDate } = req.body;
        const assignedToUser = await prisma.user.findUnique({
            where: { id: String(assignedTo) },
        }) || { name: "Unassigned" };
        const task = await prisma.task.update({
            where: { id: String(id) },
            data: {
                title,
                description,
                assignee,
                assignedTo: assignedToUser.name,
                status,
                ...(dueDate !== undefined ? { dueDate } : {}),
            },
        });
        res.status(200).json(toTaskDTO(task));
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }   
};
//19c3f701-c37a-44b1-93dc-7dcde5e638bb
//fb45e203-e6f9-416f-9956-9cae775abeb2
export const deleteTask = async (
    req: Request<{ id: string }, ApiErrorDTO>,
    res: Response<ApiErrorDTO>,
) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({
            where: { id: String(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
};