import { prisma } from "../lib/prisma";
import type { Request, Response } from 'express';

export const saveMessage = async (req: Request, res: Response) => {
  try {
    const { content, projectId, userId } = req.body;

    const message = await prisma.message.create({
      data: {
        content,
        projectId,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId as string },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

export const getProjectMessages = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    console.log('Fetching messages for projectId:', projectId);

    const messages = await prisma.message.findMany({
      where: { projectId: String(projectId) },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch (error) {
    console.error('Get project messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: String(error) });
  }
};