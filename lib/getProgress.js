import prisma from "./prisma";

export default async function getProgress(skip) {
  try {
    const init = await prisma.initial.findFirst({
      orderBy: {
        time: "desc",
      },
      skip: Number(skip),
    });

    try {
      prisma.initial.update({
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
  } catch (error) {
    console.error("initial.findMany", error);
    return {
      status: 500,
      data: { message: "initial.findMany", error: error },
    };
  }
}
