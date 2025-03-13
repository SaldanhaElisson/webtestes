"use client";

// import dynamic from "next/dynamic";
import Experiment from "./components/Experiment";

// const DynamicComponentWithNoSSR = dynamic(
//   () =>
//     import("./components/Experiment").then((mod) => {
//       console.log("Componente Experiment carregado dinamicamente");
//       return mod;
//     }),
//   { ssr: false }
// );

export default function Home() {
  return (
    <div>
      <h1>Experimento de Rastreamento Ocular</h1>
      <Experiment />
    </div>
  );
}
