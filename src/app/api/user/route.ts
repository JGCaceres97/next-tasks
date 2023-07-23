import { db } from '@/lib/db';
import { HttpStatusCode } from '@/lib/enums';
import { RegExpEmail } from '@/lib/regexp';
import { response } from '@/lib/response';
import { User } from '@prisma/client';

export async function GET() {
  try {
    const users: Omit<User, 'password'>[] = await db.user.findManyWithoutPassword();

    return response(users);
  } catch (e) {
    console.error(e);
    return response('Error getting all users', HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const { email, name, password }: Pick<User, 'email' | 'name' | 'password'> =
      await request.json();

    if (!email || !password)
      return response('Missing required parameters.', HttpStatusCode.BAD_REQUEST);

    if (!RegExpEmail.test(email))
      return response('You have entered an invalid email address.', HttpStatusCode.BAD_REQUEST);

    if (password.length < 8)
      return response(
        'The password length must be at least 8 characters.',
        HttpStatusCode.BAD_REQUEST
      );

    const userFound = await db.user.findUnique({ select: { id: true }, where: { email } });

    if (userFound) return response('The email address already exists.', HttpStatusCode.BAD_REQUEST);

    const newUser: Pick<User, 'id'> = await db.user.createAndEncryptPassword({
      email,
      name,
      password
    });

    return response(newUser, HttpStatusCode.CREATED);
  } catch (e) {
    console.error(e);
    return response('Error creating the user.', HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
