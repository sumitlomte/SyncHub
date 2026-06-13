import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { fetchAllProjectsByUserID, fetchProject, createProject, updateProject, deleteProject, getAllProjectsList } from "../api/project-api";
import type { Project, UpdateProject, CreateProject } from "../Types/project";
import { userStore } from "../store/user-store";

export default function useProjects(enableAllProjectsList: boolean = false, enableAllProjectsByUserID: boolean = true, projectId?: string) {
    const { user } = userStore.get()
    console.log("useProjects called with user:", user, "enableAllProjectsList:", enableAllProjectsList, "enableAllProjectsByUserID:", enableAllProjectsByUserID, "projectId:", projectId);
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
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    });

    const UpdateProject = useMutation<UpdateProject, Error, UpdateProject>({
        mutationFn: updateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    }); 

    const DeleteProject = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
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