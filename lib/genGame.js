import Chess from "chess.js";

export default function genGame(initialMoves) {
  initialMoves = JSON.parse(initialMoves);
  let index = 0;
  let gamesMate = [];
  let lastGame = [];
  const deep = initialMoves.length + 3;

  let tmp = new Chess();

  initialMoves.forEach((move) => {
    let moves = tmp.moves();
    tmp.move(moves[move]);
  });

  runGame(tmp.history(), initialMoves);
  return [gamesMate, lastGame];

  function runGame(game, play) {
    let gameA = new Chess();

    game.forEach((move) => {
      gameA.move(move);
    });

    let moves = gameA.moves();

    index++;
    if (index % 10 == 0) {
      console.log(index, moves.length, play.length);
    }

    lastGame = play;
    if (gameA.in_checkmate() == true) {
      gamesMate.push(newPlay);
    } else if (!gameA.game_over() && play.length <= deep) {
      for (let i = 0; i < moves.length && play.length < deep; i++) {
        let newPlay = [...play];
        newPlay.push(i);
        gameA.move(moves[i]);

        runGame(gameA.history(), newPlay);
      }
    }
  }
}
