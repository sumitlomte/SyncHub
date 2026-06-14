import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { fetchAllProjectsByUserID, fetchProject, createProject, updateProject, deleteProject, getAllProjectsList } from "../api/project-api";
import type { Project, UpdateProject, CreateProject } from "../types/project";
import { userStore } from "../store/Auth-store";
import { toastManager } from "../utils/toast";
import { logger } from "../utils/logger";

export default function useProjects(enableAllProjectsList: boolean = false, enableAllProjectsByUserID: boolean = true, projectId?: string) {
    const { user } = userStore.get()
    const queryClient = useQueryClient()

    const GetAllProjectsByUserID = useQuery<Project[]>({
        queryKey: ["projects", user?.id],
        queryFn: () => fetchAllProjectsByUserID(user?.id as string),
        staleTime: 0, 
        enabled: enableAllProjectsByUserID, 
    });

    const GetProject = useQuery<Project>({
        queryKey: ["project", projectId],
        queryFn: ({ queryKey }) => fetchProject(queryKey[1] as string),
        enabled: !!projectId, // Enable only if projectId is provided
    });

    const CreateProject = useMutation<CreateProject, Error, CreateProject>({
        mutationFn: createProject,
        onSuccess: () => {
            toastManager.success("Project created successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error) => {
            logger.error("Create project failed", error);
            toastManager.error("Failed to create project. Please try again.");
        }
    });

    const UpdateProject = useMutation<UpdateProject, Error, UpdateProject>({
        mutationFn: updateProject,
        onSuccess: () => {
            toastManager.success("Project updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error) => {
            logger.error("Update project failed", error);
            toastManager.error("Failed to update project. Please try again.");
        }
    }); 

    const DeleteProject = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            toastManager.success("Project deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
       },
        onError: (error) => {
            logger.error("Delete project failed", error instanceof Error ? error : new Error(String(error)));
            toastManager.error("Failed to delete project. Please try again.");
        }
    });

    const GetAllProjectsList = useQuery<(Project & { userId: never; description: never })[]>({
        queryKey: ["projectsList", user?.id],
        queryFn: () => getAllProjectsList(user?.id as string),
        staleTime: 0,
        enabled: enableAllProjectsList, // Enable based on parameter
    });

    return { GetAllProjectsByUserID, GetProject, CreateProject, UpdateProject, DeleteProject, GetAllProjectsList }
}