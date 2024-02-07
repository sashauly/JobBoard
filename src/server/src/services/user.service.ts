import { PrismaClient, User, Role } from "@prisma/client";

const userClient = new PrismaClient().user;

export default {
  async getAllUsers(): Promise<User[]> {
    const users = await userClient.findMany({
      include: { vacancies: true, applications: true },
    });
    return users;
  },

  async getUserById(id: string): Promise<User | null> {
    const user = await userClient.findUnique({
      where: { uid: id },
      include: { vacancies: true, applications: true },
    });
    return user;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await userClient.findUnique({
      where: { email },
      include: { vacancies: true, applications: true },
    });
    return user;
  },

  async createUser(name: string, email: string, password: string, role: Role) {
    const user = await userClient.create({
      data: { name, email, password, role },
    });
    return user;
  },

  async updateUser(id: string, updatedData: Partial<User>) {
    const result = await userClient.update({
      where: { uid: id },
      data: updatedData,
    });
    return result;
  },

  async deleteUser(id: string) {
    const result = await userClient.delete({
      where: { uid: id },
    });
    return result;
  },
};
