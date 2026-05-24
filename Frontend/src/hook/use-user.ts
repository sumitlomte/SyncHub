import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { getUsers, loginUser, registerUser, updateUser, deleteUser, logoutUser, getAssignedProjects } from "../api/user-api";
import type { User, RegisterUser, UpdateUser, LoginUser, AssignedProjects } from "../Types/user";
import { router } from "./../router"
import { saveUserToLocalStorage, clearUserFromLocalStorage } from "../store/user-store";

export default function useUsers() {
  const queryClient = useQueryClient()

  const GetAllUsers = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const LoginUser = useMutation<{ user: { name: string; id: number; role: string } }, unknown, LoginUser>({
    mutationFn: loginUser,
    onError: () => {       
        alert("Login failed. Please check your credentials and try again.");
    },
    onSuccess:(data: { user: { name: string; id: number; role: string } }) => {
        alert("Login successful! Welcome back.");
        saveUserToLocalStorage(data.user as { name: string; id: number, role: string });
        router.navigate({ to: "/projects" }); 
    }
  });       

  const RegisterUser = useMutation <unknown, unknown, RegisterUser>   ({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });       

  const UpdateUser = useMutation <unknown, unknown, UpdateUser>   ({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });       

  const DeleteUser = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });       

  const LogoutUser = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearUserFromLocalStorage();
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