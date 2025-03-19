"use client";

import { useEffect } from "react";
import { initJsPsych } from "jspsych";
import WebgazerInitCamera from "@jspsych/plugin-webgazer-init-camera";
import jsPsychPreload from "@jspsych/plugin-preload";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychWebgazerCalibrate from "@jspsych/plugin-webgazer-calibrate";
import jsPsychWebgazerValidate from "@jspsych/plugin-webgazer-validate";
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer";

import "./style.css"
import gerenateTrial from "@/utils/generateTrial";

const Experiment = () => {
  useEffect(() => {
    const jsPsych = initJsPsych({
      extensions: [{ type: jsPsychExtensionWebgazer }],


    });

    const show_data = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function () {
        // Salva os dados localmente
        jsPsych.data.get().localSave('csv', 'mydata.csv');

        // Obtém todos os dados coletados
        const trial_data = jsPsych.data.get().values();

        // Agrupa os dados por vídeo
        const data_by_video: { [key: string]: any[] } = {};
        trial_data.forEach((trial) => {
          if (trial.video_path) {
            if (!data_by_video[trial.video_path]) {
              data_by_video[trial.video_path] = [];
            }
            data_by_video[trial.video_path].push(trial);
          }
        });

        // Mapeia cada vídeo para uma cor específica
        const video_colors: { [key: string]: string } = {
          "/video.mp4": "white",   // Pontos do vídeo 1 serão brancos
          "/video2.mp4": "red",    // Pontos do vídeo 2 serão vermelhos
          "/video3.mp4": "blue",   // Pontos do vídeo 3 serão azuis
          // Adicione mais vídeos e cores conforme necessário
        };

        // Cria o HTML para exibir os dois mapas de calor
        let html = `
          <div style="
            position: fixed; /* Fixa a div na tela */
            top: 0;
            left: 0;
            width: 100vw; /* Ocupa 100% da largura da viewport */
            height: 50vh; /* Ocupa 50% da altura da viewport */
            background: rgba(0, 0, 0, 0.8); /* Fundo escuro semi-transparente */
            z-index: 1000; /* Garante que a div fique sobreposta a todo o conteúdo */
            display: flex;
            justify-content: center;
            align-items: center;
          ">
            <div style="
              position: relative;
              width: 90vw; /* 90% da largura da viewport */
              height: 90%; /* 90% da altura da div pai */
              border: 3px solid white;
              overflow: hidden; /* Garante que os pontos não ultrapassem o contêiner */
            ">
        `;


        Object.entries(data_by_video).forEach(([video_path, trials]) => {
          const color = video_colors[video_path] || "gray"; // Usa "gray" como cor padrão se o vídeo não estiver no mapeamento
          trials.forEach((trial) => {
            if (trial.webgazer_data) {
              trial.webgazer_data.forEach((gaze: { x: number; y: number }) => {
                // Coordenadas originais (não invertidas)
                const x = (gaze.x / window.innerWidth) * 100; // Converte para porcentagem da largura da tela
                const y = (gaze.y / window.innerHeight) * 100; // Converte para porcentagem da altura da tela
                html += `
                  <div style="
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: 5px;
                    height: 5px;
                    background-color: ${color};
                    transform: translate(-50%, -50%); /* Centraliza o ponto nas coordenadas */
                  "></div>
                `;
              });
            }
          });
        });

        html += `
            </div>
          </div>
    
          <div style="
            position: fixed; /* Fixa a div na tela */
            bottom: 0;
            left: 0;
            width: 100vw; /* Ocupa 100% da largura da viewport */
            height: 50vh; /* Ocupa 50% da altura da viewport */
            background: rgba(0, 0, 0, 0.8); /* Fundo escuro semi-transparente */
            z-index: 1000; /* Garante que a div fique sobreposta a todo o conteúdo */
            display: flex;
            justify-content: center;
            align-items: center;
          ">
            <div style="
              position: relative;
              width: 90vw; /* 90% da largura da viewport */
              height: 90%; /* 90% da altura da div pai */
              border: 3px solid white;
              overflow: hidden; /* Garante que os pontos não ultrapassem o contêiner */
            ">
        `;


        Object.entries(data_by_video).forEach(([video_path, trials]) => {
          const color = video_colors[video_path] || "gray"; // Usa "gray" como cor padrão se o vídeo não estiver no mapeamento
          trials.forEach((trial) => {
            if (trial.webgazer_data) {
              trial.webgazer_data.forEach((gaze: { x: number; y: number }) => {
                // Coordenadas invertidas (eixo Y invertido)
                const x = (gaze.x / window.innerWidth) * 100; // Converte para porcentagem da largura da tela
                const y_corrected = window.innerHeight - gaze.y; // Inverte o eixo Y
                const y = (y_corrected / window.innerHeight) * 100; // Converte para porcentagem da altura da tela
                html += `
                  <div style="
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: 5px;
                    height: 5px;
                    background-color: ${color};
                    transform: translate(-50%, -50%); /* Centraliza o ponto nas coordenadas */
                  "></div>
                `;
              });
            }
          });
        });

        html += `
            </div>
          </div>
        `;

        return html;
      },
      choices: [], // Sem botões de escolha
    };

    const preload = {
      type: jsPsychPreload,
      auto_preload: true
    };

    const camera_instructions = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
          <p>Esse experimento é uma versão beta</p>
          <p>A primeira etapa consiste em calibração e validação da calibração, caso os valores sejam abaixo do esperado haverá uma etapa de recalibração.</p>
          <p>Normalmente demora 30 segundos para câmara se inicializar.</p>
        `,
      choices: ["Continuar"],
    };

    const init_camera = {
      type: WebgazerInitCamera,
      instructions: `
          <p>
              Posicione sua cabeça de forma que a webcam tenha uma boa visão dos seus olhos.<br>
              Centralize seu rosto na caixa e olhe diretamente para a câmera.<br>
              É importante que você tente manter a cabeça razoavelmente parada durante o experimento, então, por favor, reserve um momento para ajustar sua posição de forma confortável.<br>
              Quando seu rosto estiver centralizado na caixa e a caixa estiver verde, você pode clicar para continuar.
          </p>`
    };

    const calibration_instructions = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
          <p>Estapa irá calibrar o sistema</p>
          <p>Você verá uma conjutno de pontos na tela, olhe fixamente para ponto.</p>
          <p>Tempo estimado: 2 minutos</p>
        `,
      choices: ["Continue"],
    };

    const calibration = {
      type: jsPsychWebgazerCalibrate,
      calibration_points: [
        [25, 25],
        [75, 25],
        [50, 50],
        [25, 75],
        [75, 75],
      ],
      calibration_mode: "click",
      point_color: "blue",
      repetitions_per_point: 3,
      randomize_calibration_order: true,

    };

    const validation_instructions = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
          <p>Agora nós iremos calcular a acuracia, estamos na etapa de validação.</p>
          <p>Olhe para os pontos que irão aparecer na tela.</p>
          <p style="font-weight: bold;">Você não rpecisa clicar neles</p>
        `,
      choices: ["Continue"],
      post_trial_gap: 1000,
    };

    const validation = {
      type: jsPsychWebgazerValidate,
      validation_points: [
        [25, 25],
        [75, 25],
        [50, 50],
        [25, 75],
        [75, 75],
      ],
      roi_radius: 200,
      target_color: "green",
      time_to_saccade: 1000,
      randomize_validation_order: true,
      validation_duration: 2000,
      data: {
        task: "validate",
      },
    };

    const recalibrate_instructions = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
          <p>A precisão da calibração está um pouco abaixo do esperado.</p>
          <p>Vamos tentar calibrar mais uma vez.</p>
          <p>Na próxima tela, olhe para os pontos e clique neles.</p>
        `,
      choices: ['OK'],
    };


    const recalibrate = {
      timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
      conditional_function: function () {
        const validation_data = jsPsych.data.get().filter({ task: 'validate' }).values()[0];
        const minimum_percent_acceptable = 80;
        return validation_data.percent_in_roi.some((x: number) => x < minimum_percent_acceptable);
      },
      data: {
        phase: 'recalibration',
      },
    };


    const begin = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `<p>A proxíma etapa consiste em localizar o caminho dos objetos maiores em vídeos.</p>
        <p>Como desafio olhe a trajetório dos maiores objetos nos vídeos3</p>
        <p>Para ir par o proxímo vídeo pressione espaço.</p>
        <p>Pressione qualquer tecla para iniciar, se precisar tirar um descanso.</p>
      `,
      choices: ["Continuar"],
    }


    jsPsych.run([
      preload,
      camera_instructions,
      init_camera,
      calibration_instructions,
      calibration,
      validation_instructions,
      validation,
      recalibrate, // Etapa de recalibração (condicional)
      begin,
      gerenateTrial(["/video.mp4", "/video2.mp4", "/video3.mp4"], "video"),
      show_data,
    ]);
  }, []);

  return <div id="jspsych-experiment"></div>;
};

export default Experiment;