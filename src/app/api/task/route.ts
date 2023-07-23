import { db } from '@/lib/db';
import { HttpStatusCode } from '@/lib/enums';
import { response } from '@/lib/response';
import { Task } from '@prisma/client';

export async function GET() {
  try {
    const users = await db.task.findMany();

    return response(users);
  } catch (e) {
    console.error(e);
    return response('Error getting all tasks', HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const { description, title, userId }: Pick<Task, 'description' | 'title' | 'userId'> =
      await request.json();

    if (!description || !title || !userId)
      return response('Missing required parameters.', HttpStatusCode.BAD_REQUEST);

    const userFound = await db.user.findUnique({ select: { id: true }, where: { id: userId } });

    if (!userFound)
      return response(`No user has been found with id ${userId}.`, HttpStatusCode.BAD_REQUEST);

    const newTask: Pick<Task, 'id'> = await db.task.create({
      data: { description, title, userId },
      select: { id: true, createdAt: true }
    });

    return response(newTask, HttpStatusCode.CREATED);
  } catch (e) {
    console.error(e);
    return response('Error creating the task.', HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
