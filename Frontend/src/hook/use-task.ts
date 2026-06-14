import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskById, getTasksByProjectId, createTask, updateTask, deleteTask } from "../api/task-api";
import type { Task, CreateTask, UpdateTask } from "../types/task";
import { toastManager } from "../utils/toast";
import { logger } from "../utils/logger";

export default function useTasks(projectId: string) {
    const queryClient = useQueryClient()

    const GetTasksByProjectId = useQuery<Task[]>({
        queryKey: ["tasksByProjectId", projectId],
        queryFn: () => getTasksByProjectId(projectId),
        enabled: !!projectId,
    });

    const GetTaskById = useQuery<Task>({
        queryKey: ["taskById"],
        queryFn: ({ queryKey }) => getTaskById(queryKey[1] as string),
        enabled: false, // Disable automatic fetching on component mount
    });

    const CreateTask = useMutation<Task, unknown, CreateTask>({
        mutationFn: createTask,
        onSuccess: () => {
            toastManager.success("Task created successfully!");
            queryClient.invalidateQueries({ queryKey: ["tasksByProjectId"] });
        },
        onError: (error) => {
            logger.error("Create task failed", error instanceof Error ? error : new Error(String(error)));
            toastManager.error("Failed to create task. Please try again.");
        }
    });

    const UpdateTask = useMutation<Task, unknown, { id: string; task: UpdateTask }>({
        mutationFn: ({ id, task }) => updateTask(id, task),
        onSuccess: () => {
            toastManager.success("Task updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["tasksByProjectId"] });
            queryClient.invalidateQueries({ queryKey: ["taskById"] });
        },
        onError: (error) => {
            logger.error("Update task failed", error instanceof Error ? error : new Error(String(error)));
            toastManager.error("Failed to update task. Please try again.");
        }
    });

    const DeleteTask = useMutation<void, unknown, string>({
        mutationFn: deleteTask,
        onSuccess: () => {
            toastManager.success("Task deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["tasksByProjectId"] });
            queryClient.invalidateQueries({ queryKey: ["taskById"] });
        },
        onError: (error) => {
            logger.error("Delete task failed", error instanceof Error ? error : new Error(String(error)));
            toastManager.error("Failed to delete task. Please try again.");
        }
    });

    return { GetTasksByProjectId, GetTaskById, CreateTask, UpdateTask, DeleteTask }
}
