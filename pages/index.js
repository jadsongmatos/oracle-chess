import Head from "next/head";
import { useState } from "react";
import genGame from "../lib/genGame";
//import Image from 'next/image'

export default function Home() {
  const [load, setLoad] = useState(false);
  const [loop,setLoop] = useState(false)
  const [chess, setChess] = useState({});

  const startGame = async () => {
    console.log("startGame");
    setLoad(true);

    const getInit = await fetch("api/progress")
      .then((response) => response.json())
      .catch((error) => {
        alert("ERROR :(");
        console.log("error", error);
      })
      .finally(() => {
        setLoad(false);
      });

    console.log(getInit);
    setChess(getInit[0]);
    if (
      getInit[0].progress == null ||
      getInit[0].progress == "" ||
      !getInit[0].progress
    ) {
      calGame(getInit[0].moves);
    } else {
      calGame(getInit[0].moves);
    }
  };

  const calGame = async (game) => {
    const result = await genGame(game);

    const post = await fetch("api/progress", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        moves: game, //"[0,0,0,1]",
        progress: JSON.stringify(result[1]), //"[0,0,0,1,1]",
        games: result[0],
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        alert("ERROR :(");
        console.log("error", error);
      });

    console.log(post);
    if(loop == true){
      startGame()
    }
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Oracle Chess" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-5 py-5">
        <section className="container mb-5 text-center">
          <h1>Oracle Chess</h1>
          <p>Bem vindo ao oracle chess</p>
          <p>Ajude nosso robo de xadrez ficar mais inteligente</p>
        </section>
        <section className="container my-5">
          <div className="mx-auto form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              onClick={(e) => {setLoop(!loop)}}
            />
            <label className="form-check-label">
              Auto
            </label>
          </div>
          <div className="d-grid gap-2 col-4 mx-auto">
            <button
              className="d-flex align-items-center mx-auto btn btn-lg btn-primary"
              type="button"
              onClick={startGame}
            >
              {load ? (
                <>
                  <span
                    className="mx-3 spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Carregando...
                </>
              ) : (
                <>Começar</>
              )}
            </button>
          </div>
        </section>
      </main>

      <footer className="bd-footer py-1 mt-5 bg-light">
        <div className="container py-1">
          <div className="row">
            <p>:D</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
