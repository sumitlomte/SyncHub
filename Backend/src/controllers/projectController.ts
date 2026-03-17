import { prisma } from "../lib/prisma";
import type { Request, Response } from 'express';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const projects = await prisma.project.findMany({
      where: { userId: String(userId) },
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: String(id) },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
    } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
    try {   
    const { id } = req.params;
    const { title, description } = req.body;
    const project = await prisma.project.update({
        where: { id: String(id) },
        data: { title, description },
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
    const { id } = req.params;
    await prisma.project.delete({
        where: { id: String(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  } 
};