import { PrismaClient, Vacancy } from "@prisma/client";

const vacancyClient = new PrismaClient().vacancy;

export default {
  async getAllVacancies(): Promise<Vacancy[]> {
    const vacancies = await vacancyClient.findMany({
      include: { employer: true, Application: true },
    });
    return vacancies;
  },

  async getVacancyById(id: string): Promise<Vacancy | null> {
    const vacancy = await vacancyClient.findUnique({
      where: { uid: id },
      include: { employer: true, Application: true },
    });
    // if (!vacancy) {
    //   throw new ApiError(HttpStatusCodes.NOT_FOUND, "Record not found");
    // }
    return vacancy;
  },

  async createVacancy(
    title: string,
    description: string,
    englishLevel: string,
    grade: number,
    tags: string[],
    isActive: boolean,
    employerId: string
  ) {
    const result = await vacancyClient.create({
      data: {
        title,
        description,
        englishLevel,
        grade,
        tags,
        isActive,
        employer: { connect: { uid: employerId } },
      },
    });
    return result;
  },

  async updateVacancy(id: string, updatedData: Partial<Vacancy>) {
    const result = await vacancyClient.update({
      where: { uid: id },
      data: updatedData,
    });
    // if (!result) {
    //   throw new ApiError(HttpStatusCodes.NOT_FOUND, "Record not found");
    // }
    return result;
  },

  async deleteVacancy(id: string): Promise<Vacancy | null> {
    const result = await vacancyClient.delete({
      where: { uid: id },
    });
    return result;
  },
};
