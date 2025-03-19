"use client";
import Experiment from "./components/Experiment";

export default function Home() {
  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ textAlign: "center" }}>Experimento de Rastreamento Ocular</h1>
      <Experiment />
    </div>
  );
}
