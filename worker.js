import genGame from './lib/genGame';

addEventListener('message', async (event) => {
  if (event.data) {
    postMessage(await genGame(event.data));
  } else {
    postMessage("Please no");
  }
})