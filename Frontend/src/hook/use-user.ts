import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { getUsers, loginUser, registerUser, updateUser, deleteUser, logoutUser, getAssignedProjects } from "../api/user-api";
import type { User, RegisterUser, UpdateUser, LoginUser, AssignedProjects } from "../types/user";
import { router } from "./../router"
import { saveUserToLocalStorage, clearUserFromLocalStorage } from "../store/Auth-store";
import { toastManager } from "../utils/toast";
import { logger } from "../utils/logger";
import { initializeSocket, disconnectSocket } from "../Socket";

export default function useUsers() {
  const queryClient = useQueryClient()

  const GetAllUsers = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const LoginUser = useMutation<{ user: { name: string; id: number; role: string } }, unknown, LoginUser>({
    mutationFn: loginUser,
    onError: (error) => {
        logger.error("Login failed", error instanceof Error ? error : new Error(String(error)));
        toastManager.error("Login failed. Please check your credentials and try again.");
    },
    onSuccess:(data: { user: { name: string; id: number; role: string } }) => {
        toastManager.success("Login successful! Welcome back.");
        saveUserToLocalStorage(data.user as { name: string; id: number, role: string });
        
        // Initialize socket connection with new user credentials
        initializeSocket();
        
        router.navigate({ to: "/projects" }); 
    }
  });       

  const RegisterUser = useMutation <unknown, unknown, RegisterUser>   ({
    mutationFn: registerUser,
    onSuccess: () => {
      toastManager.success("Registration successful!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      logger.error("Registration failed", error instanceof Error ? error : new Error(String(error)));
      toastManager.error("Registration failed. Please try again.");
    }
  });       

  const UpdateUser = useMutation <unknown, unknown, UpdateUser>   ({
    mutationFn: updateUser,
    onSuccess: () => {
      toastManager.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      logger.error("Update user failed", error instanceof Error ? error : new Error(String(error)));
      toastManager.error("Failed to update user. Please try again.");
    }
  });       

  const DeleteUser = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toastManager.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      logger.error("Delete user failed", error instanceof Error ? error : new Error(String(error)));
      toastManager.error("Failed to delete user. Please try again.");
    }
  });       

  const LogoutUser = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Disconnect socket before clearing user data
      disconnectSocket();
      
      // Clear all cached data
      queryClient.clear();
      
      toastManager.success("Logged out successfully!");
      clearUserFromLocalStorage();
    },
    onError: (error) => {
      logger.error("Logout failed", error instanceof Error ? error : new Error(String(error)));
      
      // Disconnect socket on error too
      disconnectSocket();
      
      // Clear cache on error too
      queryClient.clear();
      
      clearUserFromLocalStorage(); // Clear locally even if server call fails
      toastManager.info("Logged out locally.");
    }
  });    
  
  function GetAssignedProjects(userId: string) {
  return useQuery<AssignedProjects[]>({
    queryKey: ["assignedProjects", userId],
    queryFn: () => getAssignedProjects(userId),
  });
}

  return {GetAllUsers, LoginUser, RegisterUser, UpdateUser, DeleteUser, LogoutUser, GetAssignedProjects }
}