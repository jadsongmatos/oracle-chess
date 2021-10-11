import Chess from "chess.js";

export default async function genGame(initialMoves) {
  const initMoves = JSON.parse(initialMoves);
  console.log("initMoves", initMoves);

  let index = 0;
  let gamesMate = [];
  let lastMoves = [];
  const deep = initMoves.length + 3;

  let tmp = new Chess();

  initMoves.forEach((move) => {
    let moves = tmp.moves();
    tmp.move(moves[move]);
  });

  const tmpGame = tmp.history();
  //console.log(tmpGame);
  tmp = null;

  await runGame(tmpGame);

  const lastGame = new Chess();

  let vecLastGame = [];

  lastMoves.forEach((move) => {
    let moves = lastGame.moves();
    vecLastGame.push(moves.indexOf(move));
    lastGame.move(move);
  });

  return [gamesMate, vecLastGame];

  async function runGame(game) {
    index++;

    const gameA = new Chess();

    game.forEach((move) => {
      gameA.move(move);
    });

    const moves = gameA.moves();

    if (gameA.in_checkmate() === true) {
      const gameWin = new Chess();
      let movesWin = gameWin.moves();
      let vec = [];

      game.forEach((move) => {
        vec.push(movesWin.indexOf(move));
        gameWin.move(move);
        movesWin = gameWin.moves();
      });

      gamesMate.push(vec);
      console.log(vec);
    } else if (!gameA.game_over() && game.length < deep) {
      for (let i = 0; i < moves.length; i++) {
        let newGame = gameA.history();
        newGame.push(moves[i]);
        if (index % 100 === 0) {
          //console.log(index, i, moves.length);
          postMessage({
            type: "then",
            data: { index, i, movesLength: moves.length },
          });
        }
        lastMoves = newGame;
        runGame(newGame);
      }
    }
  }
}
