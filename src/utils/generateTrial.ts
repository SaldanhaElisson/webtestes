import VideoKeyboardResponsePlugin from "@jspsych/plugin-video-keyboard-response"; // Importe o tipo correto
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer"; // Import the jsPsychExtensionWebgazer

export default function generateTrial(filePaths: string[], typeFile: "img" | "video") {
    const trials = filePaths.map((path) => {
        return {
            type: VideoKeyboardResponsePlugin, 
            stimulus: [path],
            choices: [" "],
            width: "500px", 
            height: "auto", 
            extensions: typeFile === "video" ? [
                {
                    type: jsPsychExtensionWebgazer,
                    params: { targets: ['#jspsych-video-keyboard-response-stimulus'] },
                },
            ] : undefined,
            data: {
                video_path: path, 
            },
        };
    });


    console.log(trials)

    return {
        timeline: trials,
        randomize_order: true,
    };
}