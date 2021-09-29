import prisma from "./prisma";

export default async function getProgress(threads) {
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
      take: Number(threads),
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
        Prisma.sql`select * from initial where length < 200 order by time limit ${Number(threads)};`
      );

      last.forEach(element => {
        prisma.initial.update({
          where: {
            moves: element.moves,
          },
          data: {
            time: new Date(),
          },
          select: {
            moves: true,
            time: true,
          },
        });  
      });
      
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
