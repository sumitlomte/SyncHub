import { prisma } from "../lib/prisma";
import type { Request, Response } from 'express';
import { generateToken } from "../utils/authHelper";

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
    }
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        await prisma.user.delete({
            where: { id }
        });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};

export const updateUser = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    let { name, email, password, role } = req.body;
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if ( email === existingUser?.email) {
        return res.status(400).json({ error: "User with this email already exists" });
    }
    if (!password) {
        password = existingUser?.password ;
    }
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                password,
                role
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
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

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.email !== email || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.cookie("token", token).json({ message: "Login successful", user: { id: user.id, name: user.name, role: user.role } });
};

export const logoutUser = (req: Request, res: Response) => {
    console.log("Logging out user");
    res.clearCookie("token").json({ message: "Logged out successfully" });
};

export const assignedProjects = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const projects = await prisma.project.findMany({
            where: { userId: id }
        });
        if (projects.length === 0) {
            return res.status(404).json({ error: "No projects found for this user" });
        }
        const tasksForEachProject = await Promise.all(projects.map(async (project) => {
            const tasks = await prisma.task.findMany({
                where: { projectId: project.id , assignedUserId: id }
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
