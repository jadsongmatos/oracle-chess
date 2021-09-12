import Head from "next/head";
import { useState } from "react";
//import Image from 'next/image'

export default function Home() {
  const [load, setLoad] = useState(false);

  // Difinculdade 20^2

  //const result = genGame(new Chess().history(), [0, 0, 0, 0]);
  //console.log(result);
  //console.log(result.length);

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
          <p>Ajude nosso robo de xadres ficar mais inteligente</p>
        </section>
        <section className="my-5">
          <div className="d-grid gap-2 col-4 mx-auto">
            <button
              className="d-flex align-items-center mx-auto btn btn-lg btn-primary"
              type="button"
              onClick={(e) => {
                setLoad(true);
                console.log(e);
              }}
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
