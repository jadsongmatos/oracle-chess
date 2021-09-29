import Head from "next/head";
import { useEffect, useRef, useCallback, useState } from "react";
//import Image from 'next/image'

export default function Home() {
  const [load, setLoad] = useState(false);
  const [loop, setLoop] = useState(false);
  const [chess, setChess] = useState([]);
  const [nRanges, setNRange] = useState(0);
  const [nThreads, setNThreads] = useState(1);
  const [msg, setMsg] = useState();

  const workerRef = useRef([]);
  useEffect(() => {
    setNThreads(window.navigator.hardwareConcurrency);
    for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
      console.log("CPU", i);
      workerRef.current[i] = new Worker(
        new URL("../worker.js", import.meta.url)
      );
      workerRef.current[i].onmessage = (evt) => {
        if (evt.data.type) {
          setMsg({ thread: i, type: evt.data.type, data: evt.data.data });
        } else {
          console.log("worker: ", i, evt.data);
        }
      };

      workerRef.current[i].postMessage({ type: "test" });
    }

    return () => {
      for (let i = 0; i < nThreads; i++) {
        workerRef.current[i].terminate();
      }
    };
  }, []);

  useEffect(() => {
    console.log("msg", msg);
    if (msg) {
      if (msg.type == "then") {
        let newChes = [...chess];
        newChes[msg.thread] = { ...newChes[msg.thread], ...msg.data };
        setChess(newChes);
      } else if (msg.type == "finally") {
        let newChess = [...chess];
        
        
        console.log("finally",chess[msg.thread].moves, msg.data)
        //postGames(chess[msg.thread].moves, msg.data);
        
        newChess.pop(msg.thread);
        setChess(newChess);
      }
    }
  }, [msg]);

  const handleWork = useCallback(async (thread, value) => {
    workerRef.current[thread].postMessage(value);
  }, []);

  const startGame = async () => {
    console.log("startGame");
    setLoad(true);
    setNRange(nRanges + nThreads);

    const getInit = await fetch("api/progress/" + nThreads)
      .then((response) => response.json())
      .catch((error) => {
        alert("ERROR :(");
        console.log("fetch error", error);
      })
      .finally(() => {
        setLoad(false);
      });

    setChess(getInit);
    console.log("Chess", chess);

    for (let i = 0; i < nThreads; i++) {
      if (
        getInit[i].progress == null ||
        getInit[i].progress == "" ||
        !getInit[i].progress
      ) {
        handleWork(i, {
          type: "calGame",
          moves: getInit[i].moves,
          game: getInit[i].moves,
        });
      } else {
        handleWork(i, {
          type: "calGame",
          moves: getInit[i].progress,
          game: getInit[i].moves,
        });
      }
    }
  };

  const postGames = async (game, result) => {
    console.log("postGames",game,result)
    const post = await fetch("api/progress/post", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        moves: game, //"[0,0,0,1]",
        progress: JSON.stringify(result[1]), //"[0,0,0,1,20]",
        games: result[0],
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        alert("ERROR :(");
        console.log("error", error);
      });

    console.log(post);
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
          <h1>Jogas: {nRanges}</h1>
          <h5>{nThreads} Robôs</h5>
          <ul>
            {Array.isArray(chess)
              ? chess.map((games, i) => {
                  return (
                    <li key={i}>
                      <h5>
                        {JSON.stringify(games)} Robo: {i}
                      </h5>
                    </li>
                  );
                })
              : null}
          </ul>
          <div className="mx-auto form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              onClick={(e) => {
                setLoop(!loop);
              }}
            />
            <label className="form-check-label">Auto</label>
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
