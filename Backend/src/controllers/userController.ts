import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import { generateToken } from "../utils/authHelper";
import { toLowerCase } from "../utils/stringCase";
import { hashPassword, comparePassword } from "../utils/passwordIncrypter";
import type { ApiErrorDTO } from "../dto/common.dto";
import type { AssignedProjectDTO } from "../dto/project.dto";
import type {
    LoginUserRequestDTO,
    LoginUserResponseDTO,
    RegisterUserRequestDTO,
    RegisterUserResponseDTO,
    UpdateUserRequestDTO,
    UserDTO,
    UserMessageResponseDTO,
} from "../dto/user.dto";

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV ? process.env.NODE_ENV === "production" : true,
  sameSite: "lax" as const,
  path: "/",
};

const oneDayInMs = 24 * 60 * 60 * 1000;

export const registerUser = async (
    req: Request<Record<string, never>, RegisterUserResponseDTO | ApiErrorDTO, RegisterUserRequestDTO>,
    res: Response<RegisterUserResponseDTO | ApiErrorDTO>,
) => {
    const { name, email, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email: toLowerCase(email),
                password: hashedPassword,
                role
            }
        });
        res.status(201).json({ message: "User created successfully", user: { id: user.id } });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const deleteUser = async (
    req: Request<{ id: string }, UserMessageResponseDTO | ApiErrorDTO>,
    res: Response<UserMessageResponseDTO | ApiErrorDTO>,
) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        await prisma.user.delete({
            where: { id: String(id) }
        });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};

export const updateUser = async (
    req: Request<{ id: string }, UserMessageResponseDTO | ApiErrorDTO, UpdateUserRequestDTO>,
    res: Response<UserMessageResponseDTO | ApiErrorDTO>,
) => {
    const { id } = req.params;
    let { name, email, password, role } = req.body;
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const userToUpdate = await prisma.user.findUnique({ where: { id: String(id) } });
    if (!userToUpdate) {
        return res.status(404).json({ error: "User not found" });
    }

    if ( email === existingUser?.email) {
        if (email !== userToUpdate.email) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        else {
            email = userToUpdate.email;
        }
        
    }
    if (!password) {
        password = userToUpdate.password;
    }
    else {
        password = await hashPassword(password);
    }
    try {
        await prisma.user.update({
            where: { id: String(id) },
            data: {
                name,
                email: toLowerCase(email),
                password: password,
                role
            }
        });
        res.status(200).json({ message: "User updated successfully"});
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const getAllUsers = async (
    req: Request<Record<string, never>, UserDTO[] | ApiErrorDTO>,
    res: Response<UserDTO[] | ApiErrorDTO>,
) => {
    try {
        const users = await prisma.user.findMany();
        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json(usersWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const loginUser = async (
    req: Request<Record<string, never>, LoginUserResponseDTO | ApiErrorDTO, LoginUserRequestDTO>,
    res: Response<LoginUserResponseDTO | ApiErrorDTO>,
) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: toLowerCase(email) } });

    const isPasswordValid = await comparePassword(password, user?.password as string);

    if (!user || user.email !== toLowerCase(email) || !isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user.id, user.name, user.role);
    res.cookie("token", token, {...authCookieOptions, maxAge: oneDayInMs })
    .json({ message: "Login successful", user: { id: user.id, name: user.name, role: user.role } });
};

export const logoutUser = (
    req: Request<Record<string, never>, UserMessageResponseDTO>,
    res: Response<UserMessageResponseDTO>,
) => {
    console.log("Logging out user");
    res.clearCookie("token", authCookieOptions).json({ message: "Logged out successfully" });
};

export const assignedProjects = async (
    req: Request<{ id: string }, AssignedProjectDTO[] | ApiErrorDTO>,
    res: Response<AssignedProjectDTO[] | ApiErrorDTO>,
) => {
    const { id } = req.params;
    try {
        const projects = await prisma.project.findMany({
            where: { userId: String(id) }
        });
        if (projects.length === 0) {
            return res.status(404).json({ error: "No projects found for this user" });
        }
        const tasksForEachProject = await Promise.all(projects.map(async (project) => {
            const tasks = await prisma.task.findMany({
                where: { projectId: project.id , assignedUserId: String(id) }
            });
            const totalTasks = tasks.length;
            const todoTasks = tasks.filter(task => task.status === "TODO").length;
            const inProgressTasks = tasks.filter(task => task.status === "IN_PROGRESS").length;
            const completedTasks = tasks.filter(task => task.status === "COMPLETED").length;
            return { ...project, totalTasks, todoTasks, inProgressTasks, completedTasks };
        }));            
        console.log("Tasks found for projects:", tasksForEachProject.length);
        res.json(tasksForEachProject);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assigned projects" });
    }
};
