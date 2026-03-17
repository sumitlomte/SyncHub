import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskById, getTasksByProjectId, createTask, updateTask, deleteTask } from "../api/task-api";
import type { Task, CreateTask, UpdateTask } from "../Types/task";

export default function useTasks() {
    const queryClient = useQueryClient()
    const GetTasksByProjectId = useQuery<Task[]>({
        queryKey: ["tasksByProjectId"],
        queryFn: ({ queryKey }) => getTasksByProjectId(queryKey[1] as string),
        enabled: false, // Disable automatic fetching on component mount
    });

    const GetTaskById = useQuery<Task>({
        queryKey: ["taskById"],
        queryFn: ({ queryKey }) => getTaskById(queryKey[1] as string),
        enabled: false, // Disable automatic fetching on component mount
    });

    const CreateTask = useMutation<Task, unknown, CreateTask>({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasksByProjectId"] });
        }
    });

    const UpdateTask = useMutation<Task, unknown, { id: string; task: UpdateTask }>({
        mutationFn: ({ id, task }) => updateTask(id, task),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasksByProjectId"] });
            queryClient.invalidateQueries({ queryKey: ["taskById"] });
        }
    });

    const DeleteTask = useMutation<void, unknown, string>({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasksByProjectId"] });
            queryClient.invalidateQueries({ queryKey: ["taskById"] });
        }
    });

    return { GetTasksByProjectId, GetTaskById, CreateTask, UpdateTask, DeleteTask }
}
