import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeamMembers, removeTeamMembers } from "../api/team-api";

export default function useTeam() {
    const queryClient = useQueryClient()
    const AddTeamMembers = useMutation<
        ReturnType<typeof addTeamMembers> extends Promise<infer R> ? R : unknown,
        Error,
        Parameters<typeof addTeamMembers>[0]
    >({
        mutationFn: addTeamMembers,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project"] });
            queryClient.invalidateQueries({ queryKey: ["projectsList"] });
        }
    });
    const RemoveTeamMembers = useMutation<
        ReturnType<typeof removeTeamMembers> extends Promise<infer R> ? R : unknown,
        Error,
        Parameters<typeof removeTeamMembers>[0]
    >({
        mutationFn: removeTeamMembers,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project"] });
            queryClient.invalidateQueries({ queryKey: ["projectsList"] });
        }
    });

    return { AddTeamMembers, RemoveTeamMembers };
}