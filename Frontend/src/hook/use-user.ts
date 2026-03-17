import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { getUsers, loginUser, registerUser, updateUser, deleteUser, logoutUser, getAssignedProjects } from "../api/user-api";
import type { User, RegisterUser, UpdateUser, LoginUser, AssignedProject } from "../Types/user";
import { router } from "./../router"

export default function useUsers() {
  const queryClient = useQueryClient()

  const GetAllUsers = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const LoginUser = useMutation<unknown, unknown, LoginUser>({
    mutationFn: loginUser,
    onError: () => {       
        alert("Login failed. Please check your credentials and try again.");
    },
    onSuccess: () => {
        alert("Login successful! Welcome back.");
        // Optionally, you can also store the user data in local storage or context here
        // localStorage.setItem("user", JSON.stringify(data));
        router.navigate({ to: "/projects" }); // Redirect to projects after successful login
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
  });    
  
  function GetAssignedProjects(userId: string) {
  return useQuery<AssignedProject[]>({
    queryKey: ["assignedProjects", userId],
    queryFn: () => getAssignedProjects(userId),
  });
}

  return {GetAllUsers, LoginUser, RegisterUser, UpdateUser, DeleteUser, LogoutUser, GetAssignedProjects }
}