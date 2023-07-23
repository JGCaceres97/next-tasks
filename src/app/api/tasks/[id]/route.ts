import { HttpMethods, HttpStatusCode, MediaType } from '@/lib/enums';
import { MessageResponse, RouteProps, Task } from '@/types/api';
import { NextResponse } from 'next/server';

const DATA = 'https://jsonplaceholder.typicode.com/todos';

export async function GET(_: Request, { params: { id } }: RouteProps) {
  try {
    const response = await fetch(`${DATA}/${id}`);
    const task: Task = await response.json();

    if (!task.id)
      return NextResponse.json({ error: true, message: 'Resource not found.' } as MessageResponse, {
        status: HttpStatusCode.NOT_FOUND
      });

    return NextResponse.json(task);
  } catch (e) {
    console.error(e);

    const responseError: MessageResponse = { error: true, message: `Error getting task ${id}.` };
    return NextResponse.json(responseError, { status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function PUT(request: Request, { params: { id } }: RouteProps) {
  try {
    const body: Omit<Task, 'id'> = await request.json();

    const response = await fetch(`${DATA}/${id}`, {
      body: JSON.stringify(body),
      headers: { 'Content-Type': MediaType.JSON },
      method: HttpMethods.PUT
    });

    const editedTask: Task = await response.json();

    if (!editedTask.id)
      return NextResponse.json({ error: true, message: 'Resource not found.' } as MessageResponse, {
        status: HttpStatusCode.NOT_FOUND
      });

    return NextResponse.json(editedTask);
  } catch (e) {
    console.error(e);

    const responseError: MessageResponse = { error: true, message: `Error updating task ${id}.` };
    return NextResponse.json(responseError, { status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function DELETE(_: Request, { params: { id } }: RouteProps) {
  try {
    await fetch(`${DATA}/${id}`, {
      headers: { 'Content-Type': MediaType.JSON },
      method: HttpMethods.DELETE
    });

    return NextResponse.json({
      error: false,
      message: `Task id ${id} deleted.`
    } as MessageResponse);
  } catch (e) {
    console.error(e);

    const responseError: MessageResponse = { error: true, message: `Error deleting task ${id}.` };
    return NextResponse.json(responseError, { status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
