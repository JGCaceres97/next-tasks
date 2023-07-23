import { MessageResponse } from '@/types/api';
import { NextResponse } from 'next/server';
import { HttpStatusCode } from './enums';

type TypeResponse<T> = NextResponse<Body<T>> | NextResponse<MessageResponse>;
type Body<T> = string | object | Array<T>;

/**
 *
 * @param body Body to be send.
 * @param status HTTP status code to the response. @default OK = 200
 * @returns Next response.
 */
export function response<T>(body: Body<T>, status = HttpStatusCode.OK): TypeResponse<T> {
  const error = status >= HttpStatusCode.BAD_REQUEST;

  if (typeof body === 'string')
    return NextResponse.json({ error, message: body } as MessageResponse, { status });

  return NextResponse.json(body, { status });
}
