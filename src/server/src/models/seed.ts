import { PrismaClient, Role } from ".prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  const usersData = Array.from({ length: 5 }).map(() => ({
    id: uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement([Role.EMPLOYEE, Role.EMPLOYER]),
  }));

  const vacanciesData = Array.from({ length: 10 }).map(() => ({
    id: uuid(),
    title: faker.person.jobTitle(),
    description: faker.lorem.paragraph(),
    englishLevel: faker.helpers.arrayElement([
      "Beginner",
      "Intermediate",
      "Advanced",
    ]),
    grade: faker.number.int({ min: 1, max: 10 }),
    tags: [faker.person.jobArea(), faker.person.jobType()],
    isActive: faker.datatype.boolean(),
    employerId: faker.helpers.arrayElement(usersData.map((user) => user.id)),
  }));

  const applicationsData = Array.from({ length: 3 }).map(() => ({
    employeeId: faker.helpers.arrayElement(usersData.map((user) => user.id)),
    vacancyId: faker.helpers.arrayElement(
      vacanciesData.map((vacancy) => vacancy.id)
    ),
  }));

  await prisma.user.createMany({ data: usersData });
  await prisma.vacancy.createMany({ data: vacanciesData });
  await prisma.application.createMany({
    data: applicationsData,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
