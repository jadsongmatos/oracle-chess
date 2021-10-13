import Head from "next/head";
import {useCallback, useEffect, useRef, useState} from "react";
import Link from "next/link";
import dynamic from "next/dynamic"

const Chessground = dynamic(() => import("react-chessground"), {ssr: false})

export default function Home() {
    const [load, setLoad] = useState(false);
    const [loop, setLoop] = useState(false);
    const [robosState, setChess] = useState([0]);
    const [jogadas, setJogadas] = useState(0);
    const [nThreads, setNThreads] = useState(1);
    const [lastTime, setLastTime] = useState(0);
    const [deltaTime, setTime] = useState(0);
    const [msg, setMsg] = useState();


    const workerRef = useRef([]);
    useEffect(() => {

        setNThreads(window.navigator.hardwareConcurrency);

        //const storageChess = localStorage.getItem("chess");
        const storageJogadas = localStorage.getItem("jogadas");
        setJogadas(Number(storageJogadas));
        for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
            robosState[i] = {done: true};
        }

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
        (async () => {
            //console.log("msg", msg);
            if (msg) {
                if (msg.type) {
                    if (msg.type === "then") {
                        robosState[msg.thread].data = msg.data;
                        localStorage.setItem("chess", JSON.stringify(robosState))

                        setTime(Math.floor(-(deltaTime - performance.now()) / 1000))
                        setLastTime(performance.now())
                        setJogadas(jogadas + 100);
                        localStorage.setItem("jogadas", JSON.stringify(jogadas))
                        setLoad(true);
                    } else if (msg.type === "finally") {
                        console.log("finally:", robosState, "thread:", msg.thread);

                        robosState[msg.thread].done = true;
                        robosState[msg.thread].data.index = 0;

                        postGames(robosState[msg.thread].game.moves, msg.data)
                        if (loop) {
                            await autoPlay(msg.thread)
                        } else {
                            setLoad(false);
                        }
                    }
                }
            }
        })()
    }, [msg]);

    const autoPlay = async (thread) => {
        const game = await startGame(robosState[thread])
        robosState[thread] = {...robosState[thread], game: game, done: calGame(thread, game)}
        console.log("autoPlay", robosState)
    }

    const calGame = (thread, game) => {
        //console.log("calGame", game)
        let result = true;
        if (game.moves) {
            result = false;
            if (!game.progress || game.progress === "") {
                handleWork(thread, {
                    type: "startWorker",
                    moves: game.moves,
                    game: game.moves,
                });
            } else {
                handleWork(thread, {
                    type: "startWorker",
                    moves: game.progress,
                    game: game.moves,
                });
            }
        }
        return result
    }
    const handleWork = useCallback(async (thread, value) => {
        //console.log("handleWork", value)
        workerRef.current[thread].postMessage(value);
    }, []);

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function abbreviateNumber(value) {
        let newValue = value;
        const suffixes = ["", " Mil", " Milhões", " Bilhões", " Trilhões"];
        let suffixNum = 0;
        while (newValue >= 1000) {
            newValue /= 1000;
            suffixNum++;
        }

        newValue = newValue.toPrecision(3);

        newValue += suffixes[suffixNum];
        return newValue;
    }

    const startGame = async () => {
        setLoad(true);

        return await fetch("api/progress/" + getRandomInt(0, 1000))
            .then((resp) => resp.json())
            .catch((error) => {
                console.error("fetch error", error);
            });


    }


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
                    <p>Ajude em encotrar as melhores jogas de xadrez !</p>
                </section>
                <section className="container my-5">
                    <h1>Jogadas: {abbreviateNumber(jogadas)}</h1>
                    <ol className={"list-group list-group-numbered"}>
                        {Array.isArray(robosState)
                            ? robosState.map((game, i) => {
                                return (
                                    <li value={"Robo: " + i} key={i} className="list-group-item align-items-start">
                                        <div
                                            className="d-flex m-3 justify-content-between text-center align-items-center">
                                            {game.data ?
                                                <>
                                                    {game.data.fen ?
                                                        <Chessground
                                                            style={{width: "200px", height: "200px"}}
                                                            fen={game.data.fen}
                                                            viewOnly={true}
                                                            draggable={{enabled: false}}
                                                            addDimensionsCssVars={false}
                                                        />
                                                        : null}
                                                    {deltaTime ?
                                                        <h4>{deltaTime}s</h4>
                                                        : null}
                                                </>
                                                : null}

                                        </div>
                                        {game && game.data && game.data.index ? (
                                            <div className="progress my-3">
                                                <div
                                                    className="progress-bar progress-bar-striped"
                                                    role="progressbar"
                                                    style={{
                                                        width: Math.floor(game.data.index / 150) + "%",
                                                    }}
                                                    aria-valuenow={Math.floor(game.data.index / 150)}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {Math.floor(game.data.index)}
                                                </div>
                                            </div>
                                        ) : game.data && game.data.index === 0 ? <div>zzz</div> : null}
                                    </li>
                                )
                                    ;
                            })
                            : null}
                    </ol>
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
                            onClick={async () => {
                                console.log("Star", robosState)
                                let i = 0;
                                for (let e of robosState) {
                                    if (e.done === true) {
                                        const game = await startGame()
                                        robosState[i] = {...robosState[i], game: game, done: calGame(i, game)}
                                    }
                                    i++;
                                }
                                console.log("Star", robosState)
                            }}
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
                <section className="container text-center">
                    <div className="mb-3">
                        <p className="fst-normal">Cada pessoa tem numero de robos então uma jogada de xadrez é enviada
                            para
                            cada um dos seus
                            robos pra queles joguem todos proximos 4 movimentos,
                            depois que robo termina ele envia o resultado para banco de dados, os resultados de todas
                            pessoas pode ser usado pra encontrar qual melhor movimento em jogo em andamento.</p>
                        <Link className="stretched-link"
                              href="https://cloud.prisma.io/Slender1808/oracle-chess/databrowser">Acesse os
                            resultados</Link>
                    </div>
                    <div className="mb-3">
                        <p className="fst-normal">Para concetar diretamento com banco de dados use link abaixo</p>
                        <Link
                            href="postgresql://livre:123456@8.tcp.ngrok.io:15994/postgres"
                            style={{fontSize: "0.7rem !important"}}
                            alt="postgresql://livre:123456@8.tcp.ngrok.io:15994/postgres"
                        >
                            postgresql://livre:123456@8.tcp.ngrok.io:15994/postgres
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="bd-footer py-1 mt-5 bg-light">
                <div className="container py-1">
                    <div className="row">
                        <Link href="https://github.com/Slender1808/oracle-chess">participe :D</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
