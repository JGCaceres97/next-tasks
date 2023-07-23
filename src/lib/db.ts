import { encrypt } from '@/lib/crypt';
import { Prisma, PrismaClient, User } from '@prisma/client';

const userExtension = {
  async createAndEncryptPassword(data: Pick<User, 'email' | 'name' | 'password'>) {
    const encryptedPassword = await encrypt(data.password);

    return prisma.user.create({
      data: { ...data, password: encryptedPassword },
      select: { id: true, createdAt: true }
    });
  },
  async findUniqueWithoutPassword(where: Prisma.UserWhereUniqueInput, includeTask = false) {
    return prisma.user.findUnique({
      select: { id: true, email: true, name: true, createdAt: true, tasks: includeTask },
      where
    });
  },
  async findManyWithoutPassword(includeTasks = false) {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true, tasks: includeTasks }
    });
  },
  async updatePassword({ id, password }: Pick<User, 'id' | 'password'>) {
    const encryptedPassword = await encrypt(password);

    return prisma.user.update({ data: { password: encryptedPassword }, where: { id } });
  },
  async updateWithoutPassword(
    data: Pick<User, 'email' | 'name'>,
    where: Prisma.UserWhereUniqueInput
  ) {
    return prisma.user.update({ data, where });
  },
  async deleteWithoutPassword(where: Prisma.UserWhereUniqueInput) {
    return prisma.user.delete({ select: { id: true }, where });
  }
};

const prisma = new PrismaClient({ errorFormat: 'pretty' }).$extends({
  model: { user: userExtension }
});

export { prisma as db };
