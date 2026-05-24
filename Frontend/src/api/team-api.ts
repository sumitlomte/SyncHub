import api from "./axios";
import type { AddRemoveTeamMember } from "../Types/team";

export const addTeamMembers = async (data: AddRemoveTeamMember) => {
    const { productId, userIds } = data;
    const response = await api.post(`/teams/${productId}/addTeamMembers`, {
        userIds
    });
    return response.data;
}

export const removeTeamMembers = async (data: AddRemoveTeamMember) => {
    const { productId, userIds } = data;
    const response = await api.post(`/teams/${productId}/removeTeamMembers`, {
        userIds
    });
    return response.data;
}