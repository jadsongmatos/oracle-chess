import prisma from "./prisma";

export default async function getProgress() {
  try {
    const init = await prisma.initial.findFirst({
      where: {
        progress: { equals: null },
      },
      orderBy: {
        time: "desc",
      },
    });

    if (init.length != 0) {
      try {
        const aa = await prisma.initial.update({
          where: {
            moves: init.moves,
          },
          data: {
            time: new Date(),
          },
          select: {
            moves: true,
            time: true,
          },
        });

        console.log("update data", aa);

        return {
          status: 200,
          data: init,
        };
      } catch (error) {
        console.error("update", error);
        return {
          status: 500,
          data: { message: "update", error: error },
        };
      }
    }

    try {
      const last = await prisma.$queryRaw(
        Prisma.sql`select * from initial where length < 200 order by time limit 1;`
      );

      last.forEach((element) => {
        console.log("new Date", element.moves);
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
