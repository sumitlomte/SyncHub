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
        teamMembers: {
          create: {
            userId,
          },
        },
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
      where: { teamMembers: { some: { userId: String(userId) } } },
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectWithTeamMembers = await prisma.project.findUnique({
      where: { id: String(id) },
      include: {teamMembers: {
        include: {
          user: true,
        },
      },},
    });
    const project = projectWithTeamMembers ? {
      id: projectWithTeamMembers.id,
      title: projectWithTeamMembers.title,
      teamMember:[
        ...projectWithTeamMembers.teamMembers.map(tm => ({
          id: tm.user.id,
          name: tm.user.name,
          email: tm.user.email,
          role: tm.user.role,
        }))
      ]
    } : null; 
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
    // Delete associated team members first (foreign key constraint)
    await prisma.teamMember.deleteMany({
        where: { projectId: String(id) },
    });
    // Then delete the project
    await prisma.project.delete({
        where: { id: String(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project', details: (error as Error).message });
  } 
};

export const getProjectsList = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const projects = await prisma.project.findMany({
      where: { teamMembers: { some: { userId: String(userId) } } },
      select: {
        id: true,
        title: true,
        teamMembers: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }) as Array<{
      id: string;
      title: string;
      teamMembers: { user: { id: string; name: string } }[];
    }>;

    // Map the Prisma nested result to the exact format you requested
    const projectsWithMembers = projects.map(project => ({
      id: project.id,
      title: project.title,
      teamMembers: project.teamMembers.map((tm) => tm.user),
    }));
    
    res.status(200).json(projectsWithMembers);
  } catch (error) {
    console.error('getProjectsList error:', error);
    res.status(500).json({ error: 'Failed to retrieve projects list', details: (error as Error).message });
  }
};