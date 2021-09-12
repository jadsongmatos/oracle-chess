onmessage = function (e) {
  if (e.data) {
    //genGame(game);
    postMessage(e.data);
  } else {
    postMessage("Please no");
  }
};
