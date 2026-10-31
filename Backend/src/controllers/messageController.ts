import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import type { ApiErrorDTO } from "../dto/common.dto";
import type { CreateMessageRequestDTO, MessageDTO } from "../dto/message.dto";

const toMessageDTO = <T extends { createdAt: Date; updatedAt: Date }>(message: T) => ({
  ...message,
  createdAt: message.createdAt.toISOString(),
  updatedAt: message.updatedAt.toISOString(),
});

export const saveMessage = async (
  req: Request<Record<string, never>, MessageDTO | ApiErrorDTO, CreateMessageRequestDTO>,
  res: Response<MessageDTO | ApiErrorDTO>,
) => {
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

    res.status(201).json(toMessageDTO(message));
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

export const getMessage = async (
  req: Request<{ messageId: string }, MessageDTO | ApiErrorDTO>,
  res: Response<MessageDTO | ApiErrorDTO>,
) => {
  try {
    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        document: {
          select: { id: true, fileName: true, fileType: true, fileSize: true },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(toMessageDTO(message));
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

export const getProjectMessages = async (
  req: Request<{ projectId: string }, MessageDTO[] | ApiErrorDTO>,
  res: Response<MessageDTO[] | ApiErrorDTO>,
) => {
  try {
    const { projectId } = req.params;
    console.log('Fetching messages for projectId:', projectId);

    const messages = await prisma.message.findMany({
      where: { projectId: String(projectId) },
      include: {
        user: { select: { id: true, name: true } },
        document: {
          select: { id: true, fileName: true, fileType: true, fileSize: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages.map(toMessageDTO));
  } catch (error) {
    console.error('Get project messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: String(error) });
  }
};