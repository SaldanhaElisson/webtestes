"use client";

import { useEffect } from "react";
import { initJsPsych } from "jspsych";
import WebgazerInitCamera from "@jspsych/plugin-webgazer-init-camera";
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer";
import jsPsychPreload from "@jspsych/plugin-preload";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychWebgazerCalibrate from "@jspsych/plugin-webgazer-calibrate";
import jsPsychWebgazerValidate from "@jspsych/plugin-webgazer-validate";
import webgazer from "webgazer";

const Experiment = () => {
  useEffect(() => {
    const jsPsych = initJsPsych({
      extensions: [{ type: jsPsychExtensionWebgazer }],
    });

    const show_data = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function () {
        const trial_data = jsPsych.data.getLastTrialData().values();
        const trial_json = JSON.stringify(trial_data, null, 2);
        return `<p style="margin-bottom:0px;"><strong>Trial data:</strong></p>
            <pre style="margin-top:0px;text-align:left;">${trial_json}</pre>`;
      },
      choices: "NO_KEYS",
    };

    const preload = {
      type: jsPsychPreload,
      images: ["globe.svg"],
    };

    const camera_instructions = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
          <p>In order to participate you must allow the experiment to use your camera.</p>
          <p>You will be prompted to do this on the next screen.</p>
          <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
          <p>It may take up to 30 seconds for the camera to initialize after you give permission.</p>
        `,
      choices: ["Got it"],
    };

    const init_camera = {
      type: WebgazerInitCamera,
    };

    const calibration_instructions = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
          <p>Now you'll calibrate the eye tracking, so that the software can use the image of your eyes to predict where you are looking.</p>
          <p>You'll see a series of dots appear on the screen. Look at each dot and click on it.</p>
        `,
      choices: ["Got it"],
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
      repetitions_per_point: 2,
      randomize_calibration_order: true,
    };

    const validation_instructions = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
          <p>Now we'll measure the accuracy of the calibration.</p>
          <p>Look at each dot as it appears on the screen.</p>
          <p style="font-weight: bold;">You do not need to click on the dots this time.</p>
        `,
      choices: ["Got it"],
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
      time_to_saccade: 1000,
      validation_duration: 2000,
      data: {
        task: "validate",
      },
    };

    jsPsych.run([
      preload,
      camera_instructions,
      init_camera,
      calibration_instructions,
      calibration,
      validation_instructions,
      validation,
      show_data,
    ]);
  }, []);

  return <div id="jspsych-experiment"></div>;
};

export default Experiment;
