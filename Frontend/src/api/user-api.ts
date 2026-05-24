import api from "./axios";
import type { RegisterUser, UpdateUser, LoginUser } from "../Types/user";


export const getUsers = async () => {
  const response = await api.get(`/users`);
  return response.data;
};

export const loginUser = async (loginCredentails : LoginUser) => {
  const {email, password} = loginCredentails  ;
  const response = await api.post(`/users/login`, {
    email,
    password
  });
  return response.data;
}

export const registerUser = async (registerCredentails : RegisterUser) => {
  const {name, email, password, role} = registerCredentails;
  const response = await api.post(`/users/register`, {
    name,
    email,
    password,
    role
  });
  return response.data;
}

export const updateUser = async (updateCredentails: UpdateUser) => {
  const {name, email, password, role, id} = updateCredentails;
  const response = await api.put(`/users/${id}`, {  
    name,
    email,
    password,
    role
  });
  return response.data;
}

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}

export const logoutUser = async () => {
  const response = await api.post(`/users/logout`);
  return response.data;   
}

export const getAssignedProjects = async (userId: string) => {
  const response = await api.get(`/users/assignedProjects/${userId}`);
  return response.data;
}
