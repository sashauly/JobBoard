import React from "react";

const vacancies = [
  {
    uid: "uid1",
    title: "Good title",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus, a?",
    englishLevel: "englishLevel",
    grade: "grade",
    tags: ["tag1", "tag2"],
    isActive: true,
    employer: "employer",
    createdAt: "20.02.2022",
  },
  {
    uid: "uid2",
    title: "Bad job",
    description: "Lorem ipsum dolor sit amet.",
    englishLevel: "A1",
    grade: "grade",
    tags: ["Cool", "Awesome"],
    isActive: true,
    employer: "employer",
    createdAt: "20.02.2022",
  },
  {
    uid: "uid3",
    title: "Good job",
    description: " sit amet consectetur, adipisicing elit. Doloribus, a?",
    englishLevel: "B2",
    grade: "11",
    tags: ["tag1", "tag2"],
    isActive: true,
    employer: "employer",
    createdAt: "20.02.2022",
  },
];

export const VacancyContext = React.createContext(vacancies);
