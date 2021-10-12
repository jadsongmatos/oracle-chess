import genGame from "./lib/genGame";

addEventListener("message", async (event) => {
  if (event.data) {
    if (event.data.type === "test") {
      postMessage("Test OK");
    } else if (event.data.type === "startWorker") {
      postMessage({
        type: "finally",
        data: await genGame(event.data.moves)
      });
    } else {
      postMessage("type undefined");
    }
  } else {
    postMessage("Please no");
  }
});
