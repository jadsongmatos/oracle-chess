import prisma from "./prisma";

export default async function getProgress() {
  try {
    const init = await prisma.initial.findMany({
      where: {
        AND: [
          {
            progress: { equals: null },
          },
        ],
      },
      orderBy: [
        {
          time: "desc",
        },
      ],
      take: 1,
      skip: 0,
      select: {
        moves: true,
        progress: true,
        time: true,
        length: true,
      },
    });

  
    if (init.length != 0) {
      return {
        status: 200,
        data: init,
      };
    }
    try {
      const last = await prisma.$queryRaw(
        Prisma.sql`select * from initial where length < 200 order by time limit 1;`
      );
      return {
        status: 200,
        data: last,
      };
    } catch (error) {
      console.error("queryRaw", error);
      return {
        status: 500,
        data: { message: "queryRaw", error: error },
      };
    }
  } catch (error) {
    console.error("initial.findMany", error);
    return {
      status: 500,
      data: { message: "initial.findMany", error: error },
    };
  }
}
