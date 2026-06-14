import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeamMembers, removeTeamMembers } from "../api/team-api";
import { toastManager } from "../utils/toast";
import { logger } from "../utils/logger";

export default function useTeam() {
    const queryClient = useQueryClient()
    const AddTeamMembers = useMutation<
        ReturnType<typeof addTeamMembers> extends Promise<infer R> ? R : unknown,
        Error,
        Parameters<typeof addTeamMembers>[0]
    >({
        mutationFn: addTeamMembers,
        onSuccess: () => {
            toastManager.success("Team members added successfully!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
            queryClient.invalidateQueries({ queryKey: ["projectsList"] });
        },
        onError: (error) => {
            logger.error("Add team members failed", error);
            toastManager.error("Failed to add team members. Please try again.");
        }
    });
    const RemoveTeamMembers = useMutation<
        ReturnType<typeof removeTeamMembers> extends Promise<infer R> ? R : unknown,
        Error,
        Parameters<typeof removeTeamMembers>[0]
    >({
        mutationFn: removeTeamMembers,
        onSuccess: () => {
            toastManager.success("Team member removed successfully!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
            queryClient.invalidateQueries({ queryKey: ["projectsList"] });
        },
        onError: (error) => {
            logger.error("Remove team members failed", error);
            toastManager.error("Failed to remove team member. Please try again.");
        }
    });

    return { AddTeamMembers, RemoveTeamMembers };
}