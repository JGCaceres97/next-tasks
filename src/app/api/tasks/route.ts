import { HttpMethods, HttpStatusCode, MediaType } from '@/lib/enums';
import { MessageResponse, Task } from '@/types/api';
import { NextResponse } from 'next/server';

const DATA = 'https://jsonplaceholder.typicode.com/todos';

export async function GET() {
  try {
    const response = await fetch(DATA);
    const tasks: Task[] = await response.json();

    return NextResponse.json(tasks);
  } catch (e) {
    console.error(e);

    const responseError: MessageResponse = { error: true, message: 'Error getting all tasks.' };
    return NextResponse.json(responseError, { status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function POST(request: Request) {
  try {
    const body: Omit<Task, 'id'> = await request.json();

    const response = await fetch(DATA, {
      body: JSON.stringify(body),
      headers: { 'Content-Type': MediaType.JSON },
      method: HttpMethods.POST
    });

    const newTask: Task = await response.json();

    return NextResponse.json(newTask, { status: HttpStatusCode.CREATED });
  } catch (e) {
    console.error(e);

    const responseError: MessageResponse = { error: true, message: 'Error creating task.' };
    return NextResponse.json(responseError, { status: HttpStatusCode.INTERNAL_SERVER_ERROR });
  }
}
