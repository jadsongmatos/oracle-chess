import Head from "next/head";
import {useCallback, useEffect, useRef, useState} from "react";
//import Image from 'next/image'

export default function Home() {
    const [load, setLoad] = useState(false);
    const [loop, setLoop] = useState(false);
    const [chess, setChess] = useState([0]);
    const [nRanges, setNRange] = useState(0);
    const [nThreads, setNThreads] = useState(1);
    const [msg, setMsg] = useState();

    const workerRef = useRef([]);
    useEffect(() => {
        setNThreads(window.navigator.hardwareConcurrency);

        let newChess = [];
        for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
            newChess[i] = {done: true};
        }
        setChess(newChess);

        for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
            console.log("CPU", i);
            workerRef.current[i] = new Worker(
                new URL("../worker.js", import.meta.url)
            );
            workerRef.current[i].onmessage = (evt) => {
                //console.log("workerRef",evt.data)
                if (evt.data.type) {
                    setMsg({thread: i, type: evt.data.type, data: evt.data.data});
                } else {
                    console.log("worker: ", i, evt.data);
                }
            };
        }

        return () => {
            for (let i = 0; i < nThreads; i++) {
                workerRef.current[i].terminate();
            }
        };
    }, []);

    useEffect(() => {
        //console.log("msg", msg);
        if (msg) {
            if (msg.type) {
                if (msg.type === "then") {
                    let newChes = [...chess];
                    newChes[msg.thread].data = msg.data;
                    setChess(newChes);

                    setNRange(nRanges + 100);
                    setLoad(true);
                } else if (msg.type === "finally") {
                    console.log("finally:", chess, "thread:", msg.thread);

                    let newChess = [...chess];
                    newChess[msg.thread].done = true;
                    newChess[msg.thread].data.index = 0;
                    setChess(newChess);

                    postGames(chess[msg.thread].game.moves, msg.data)
                    if (loop) {
                        setMsg({type: "statGame"});
                    } else {
                        setLoad(false);
                    }
                } else if (msg.type === "calGame") {
                    calGame()
                } else if (msg.type === "statGame") {
                    startGame();
                }
            }
        }
    }, [msg]);

    const calGame = async () => {
        console.log("calGame", chess)
        let newChess = [...chess];
        chess.forEach((e, i) => {
            if (e.done === "new") {
                if (e.game) {
                    if (e.game.moves) {
                        newChess[i].done = false;
                        if (e.game.progress === null || e.game.progress === "" || !e.game.progress) {
                            handleWork(i, {
                                type: "calGame",
                                moves: e.game.moves,
                                game: e.game.moves,
                            });
                        } else {
                            handleWork(i, {
                                type: "calGame",
                                moves: e.game.progress,
                                game: e.game.moves,
                            });
                        }
                    }
                }
            }
        });
        setChess(newChess);
    }
    const handleWork = useCallback(async (thread, value) => {
        console.log("handleWork", value)
        workerRef.current[thread].postMessage(value);
    }, []);

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const startGame = async () => {
        console.log("startGame", chess);
        setLoad(true);
        if (Array.isArray(chess)) {
            const gamesPromises = chess.map(async (e, i) => {
                if (e.done === true) {
                    console.log("done true", i)
                    return await fetch("api/progress/" + getRandomInt(0, 1000))
                        .then((resp) => resp.json())
                        .catch((error) => {
                            console.error("fetch error", error);
                        });
                } else {
                    return false
                }
            })

            let newChess = [...chess];
            const games = await Promise.all(gamesPromises)
            console.log(games)
            games.forEach((e, i) => {
                if (e != false) {
                    newChess[i].game = e;
                    newChess[i].done = "new"
                }
            })
            setChess(newChess);
            setMsg({type: "calGame"});
        } else {
            let newChess = [];
            for (let i = 0; i < nThreads; i++) {
                newChess[i] = {done: true};
            }
            setChess(newChess);
        }
    };

    const postGames = (game, result) => {
        console.log("postGame", game)
        fetch("api/progress/post", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                moves: game, //"[0,0,0,1]",
                progress: JSON.stringify(result[1]), //"[0,0,0,1,20]",
                gamesWins: result[0],
            }),
        }).then((response) => response.text()).catch((error) => {
            alert("ERROR :(");
            console.log("error", error);
        });
    };

    return (
        <div>
            <Head>
                <title>Oracle Chess</title>
                <meta name="description" content="Oracle Chess"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="mt-5 py-5">
                <section className="container mb-5 text-center">
                    <h1>Oracle Chess</h1>
                    <p>Bem vindo ao oracle chess</p>
                    <p>Ajude em encotrar as melhores jogas de xadrez</p>
                </section>
                <section className="container my-5">
                    <h1>Jogas: {nRanges}</h1>

                    <h5>{nThreads} Robôs</h5>
                    <ul>
                        {Array.isArray(chess)
                            ? chess.map((games, i) => {
                                return (
                                    <li key={i}>
                                        <h5>Robo: {i + 1}</h5>
                                        {games && games.data && games.data.index ? (
                                            <div className="progress">
                                                <div
                                                    className="progress-bar progress-bar-striped"
                                                    role="progressbar"
                                                    style={{
                                                        width: Math.floor(games.data.index / 150) + "%",
                                                    }}
                                                    aria-valuenow={Math.floor(games.data.index / 150)}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {Math.floor(games.data.index / 150)}%
                                                </div>
                                            </div>
                                        ) : null}
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
                                    Jogando...
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
