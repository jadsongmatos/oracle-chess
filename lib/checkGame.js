import { Chess } from "chess.js";

export default function checkGame(game) {
  let chess = new Chess();
  let moves = chess.moves();


  for (let index = 0; index < game.length; index++) {
    if (moves[game[index]] != undefined) {
      chess.move(moves[game[index]]);
      moves = chess.moves();
    } else {
      return false
    }
  }

  return true
}
