import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { fetchAllProjectsByUserID, fetchProject, createProject, updateProject, deleteProject } from "../api/project-api";
import type { Project, UpdateProject, CreateProject } from "../Types/project";

export default function useProjects() {
    const queryClient = useQueryClient()
    const GetAllProjectsByUserID = useQuery<Project[]>({
        queryKey: ["projects"],
        queryFn: ({ queryKey }) => fetchAllProjectsByUserID(queryKey[1] as string),
        enabled: false, // Disable automatic fetching on component mount
    });

    const GetProject = useQuery<Project>({
        queryKey: ["project"],
        queryFn: ({ queryKey }) => fetchProject(queryKey[1] as string),
        enabled: false, // Disable automatic fetching on component mount
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

    return { GetAllProjectsByUserID, GetProject, CreateProject, UpdateProject, DeleteProject }
}