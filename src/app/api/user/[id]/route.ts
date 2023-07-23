import { decrypted } from '@/lib/crypt';
import { db } from '@/lib/db';
import { HttpStatusCode } from '@/lib/enums';
import { RegExpEmail } from '@/lib/regexp';
import { response } from '@/lib/response';
import { Password, RouteProps } from '@/types/api';
import { User } from '@prisma/client';

export async function GET(_: Request, { params: { id } }: RouteProps) {
  try {
    const userFound = await db.user.findUniqueWithoutPassword({ id });

    if (!userFound)
      return response(`No user has been found with id ${id}.`, HttpStatusCode.NOT_FOUND);

    return response(userFound);
  } catch (e) {
    console.error(e);
    return response(`Error getting user ${id}.`, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request, { params: { id } }: RouteProps) {
  try {
    const { email, newPassword, oldPassword }: Password = await request.json();

    if (!email || !newPassword || !oldPassword)
      return response('Missing required parameters.', HttpStatusCode.BAD_REQUEST);

    if (!RegExpEmail.test(email))
      return response('You have entered an invalid email address.', HttpStatusCode.BAD_REQUEST);

    if (newPassword.length < 8)
      return response(
        'The password length must be at least 8 characters.',
        HttpStatusCode.BAD_REQUEST
      );

    if (newPassword === oldPassword)
      return response(
        'The new password and the old one cannot be the same.',
        HttpStatusCode.BAD_REQUEST
      );

    const userFound = await db.user.findUnique({
      select: { email: true, password: true },
      where: { id, email }
    });

    const passwordMatch = await decrypted(oldPassword, userFound?.password);

    if (!userFound || !passwordMatch)
      return response('Invalid credentials.', HttpStatusCode.BAD_REQUEST);

    await db.user.updatePassword({ id, password: newPassword });

    return response(
      { error: false, message: `Password for user ${id} has been updated.` },
      HttpStatusCode.CREATED
    );
  } catch (e) {
    console.error(e);
    return response(
      `Error updating password for user ${id}.`,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
}

export async function PUT(request: Request, { params: { id } }: RouteProps) {
  try {
    const { email, name }: Pick<User, 'email' | 'name'> = await request.json();

    if (!email) return response('Missing required parameters.', HttpStatusCode.BAD_REQUEST);

    if (!RegExpEmail.test(email))
      return response('You have entered an invalid email address.', HttpStatusCode.BAD_REQUEST);

    const userFound = await db.user.findUnique({ select: { id: true }, where: { id } });

    if (!userFound)
      return response(`No user has been found with id ${id}.`, HttpStatusCode.NOT_FOUND);

    await db.user.updateWithoutPassword({ email, name }, { id });

    return response({ error: false, message: `User ${id} has been updated.` });
  } catch (e) {
    console.error(e);
    return response(`Error updating user ${id}.`, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function DELETE(request: Request, { params: { id } }: RouteProps) {
  try {
    const { email, password }: Pick<User, 'email' | 'password'> = await request.json();

    if (!email || !password)
      return response('Missing required parameters.', HttpStatusCode.BAD_REQUEST);

    if (!RegExpEmail.test(email))
      return response('You have entered an invalid email address.', HttpStatusCode.BAD_REQUEST);

    const userFound = await db.user.findUnique({
      select: { password: true },
      where: { id, email }
    });

    const passwordMatch = await decrypted(password, userFound?.password);

    if (!userFound || !passwordMatch)
      return response('Invalid credentials.', HttpStatusCode.BAD_REQUEST);

    await db.user.deleteWithoutPassword({ id });

    return response({ error: false, message: `User ${id} has been deleted.` });
  } catch (e) {
    console.error(e);
    return response(`Error deleting user ${id}.`, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
