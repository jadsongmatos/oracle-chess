import { Chess } from "chess.js";

export default function genGame(history, initialMoves) {
  let index = 0;
  let gamesMate = [];
  const deep = initialMoves.length + 11;

  runGame(history, initialMoves);
  return gamesMate;

  function runGame(game, play) {
    let gameA = new Chess();

    game.forEach((move) => {
      gameA.move(move);
    });

    let moves = gameA.moves();

    index++;
    if (index % 10 == 0) {
      //console.log(index, moves.length, play.length);
    }

    console.log(index, moves.length,play, play.length);

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
