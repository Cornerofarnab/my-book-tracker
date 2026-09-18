import { PrismaClient, BookStatus, MovieStatus } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.movie.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "demo@library.local",
      name: "Demo Reader",
    },
  });

  await prisma.book.createMany({
    data: [
      {
        userId: user.id,
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        genre: "Fantasy",
        year: 2007,
        status: BookStatus.READING,
        rating: 5,
        notes: "Beautiful prose. Halfway through the University chapters.",
      },
      {
        userId: user.id,
        title: "Project Hail Mary",
        author: "Andy Weir",
        genre: "Science Fiction",
        year: 2021,
        status: BookStatus.FINISHED,
        rating: 5,
        notes: "Smart, funny, and surprisingly emotional.",
      },
      {
        userId: user.id,
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        genre: "Literary Fiction",
        year: 2021,
        status: BookStatus.WANT_TO_READ,
      },
      {
        userId: user.id,
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Nonfiction",
        year: 2018,
        status: BookStatus.FINISHED,
        rating: 4,
        notes: "Practical systems for small daily changes.",
      },
    ],
  });

  await prisma.movie.createMany({
    data: [
      {
        userId: user.id,
        title: "Arrival",
        director: "Denis Villeneuve",
        genre: "Science Fiction",
        year: 2016,
        status: MovieStatus.WATCHED,
        rating: 5,
        notes: "Language, time, and grief — still thinking about it.",
      },
      {
        userId: user.id,
        title: "Dune: Part Two",
        director: "Denis Villeneuve",
        genre: "Science Fiction",
        year: 2024,
        status: MovieStatus.WATCHLIST,
      },
      {
        userId: user.id,
        title: "Past Lives",
        director: "Celine Song",
        genre: "Drama",
        year: 2023,
        status: MovieStatus.WATCHING,
        rating: 4,
      },
      {
        userId: user.id,
        title: "Spirited Away",
        director: "Hayao Miyazaki",
        genre: "Animation",
        year: 2001,
        status: MovieStatus.WATCHED,
        rating: 5,
        notes: "Comfort watch. Bathhouse sequence is perfect.",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
