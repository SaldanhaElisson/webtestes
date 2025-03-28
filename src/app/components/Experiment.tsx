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
        jsPsych.data.get().localSave('csv', 'eye-tracking-data.csv');

        const trial_data = jsPsych.data.get().values();

        const data_by_media: { [key: string]: any[] } = {};
        trial_data.forEach((trial) => {
          const media_path = trial.path
          if (media_path) {
            if (!data_by_media[media_path]) {
              data_by_media[media_path] = [];
            }
            data_by_media[media_path].push(trial);
          }
        });

        const media_colors: { [key: string]: string } = {
          "/image1.jpg": "rgba(255, 255, 255, 0.7)",
          "/image2.jpg": "rgba(255, 0, 0, 0.7)",
          "/image3.jpg": "rgba(0, 0, 255, 0.7)",

        };


        let html = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          ">
            <h2 style="color: white; margin-bottom: 20px;">Visualização dos Pontos de Gaze</h2>
            
            <div style="
              position: relative;
              width: 100vw;
              height: 100vh;
              border: 3px solid white;
              overflow: hidden;
              background: rgba(0, 0, 0, 0.7);
            ">
        `;

        Object.entries(data_by_media).forEach(([media_path, trials]) => {
          const color = media_colors[media_path] || "rgba(128, 128, 128, 0.7)";
          trials.forEach((trial) => {
            if (trial.webgazer_data) {
              trial.webgazer_data.forEach((gaze: { x: number; y: number }) => {
                const x = (gaze.x / window.innerWidth) * 100;
                const y = (gaze.y / window.innerHeight) * 100;

                html += `
                  <div style="
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: 8px;
                    height: 8px;
                    background-color: ${color};
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
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
      choices: [],
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
      point_size: 30,
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
      roi_radius: 100,
      target_color: "green",
      time_to_saccade: 1000,
      randomize_validation_order: true,
      validation_duration: 3000,
      point_size: 30,
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
      stimulus: `<p>A proxíma etapa consiste em localizar os objetos</p>
        <p>Como desafio encare os objetos por alguns segundos</p>
        <p>Para ir a proxíma imagem pressione espaço.</p>
        <p>Click em continuar, se precisar tirar um descanso.</p>
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
      recalibrate,
      begin,
      gerenateTrial(["/image1.jpg", "/image2.jpg", "/image3.jpg"], "img"),
      show_data,
    ]);
  }, []);

  return <div id="jspsych-experiment"></div>;
};

export default Experiment;