import { db } from '@/lib/db';
import { HttpStatusCode } from '@/lib/enums';
import { response } from '@/lib/response';
import { RouteProps } from '@/types/api';
import { Task } from '@prisma/client';

export async function GET(_: Request, { params: { id } }: RouteProps) {
  try {
    const userFound = await db.user.findUniqueWithoutPassword({ id });
    if (userFound) {
      const userTasks = await db.task.findMany({ where: { userId: id } });
      return response(userTasks);
    }

    const taskFound = await db.task.findUnique({ where: { id } });
    if (!taskFound)
      return response(`No task has been found with id ${id}.`, HttpStatusCode.NOT_FOUND);

    return response(taskFound);
  } catch (e) {
    console.error(e);
    return response(`Error getting task ${id}.`, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function PUT(request: Request, { params: { id } }: RouteProps) {
  try {
    const {
      completed = false,
      description,
      title
    }: Pick<Task, 'completed' | 'description' | 'title'> = await request.json();

    if (!description || !title)
      return response('Missing required parameters.', HttpStatusCode.BAD_REQUEST);

    const taskFound = await db.task.findUnique({ select: { id: true }, where: { id } });
    if (!taskFound)
      return response(`No task has been found with id ${id}.`, HttpStatusCode.NOT_FOUND);

    await db.task.update({ data: { completed, description, title }, where: { id } });

    return response(`Task ${id} has been updated.`);
  } catch (e) {
    console.error(e);
    return response(`Error updating task ${id}.`, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function DELETE(_: Request, { params: { id } }: RouteProps) {
  try {
    const taskFound = await db.task.findUnique({ select: { id: true }, where: { id } });

    if (!taskFound)
      return response(`No task has been found with id ${id}.`, HttpStatusCode.NOT_FOUND);

    await db.task.delete({ where: { id } });

    return response(`Task ${id} has been deleted.`);
  } catch (e) {
    console.error(e);
    return response(`Error deleting task ${id}.`, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
