import VideoKeyboardResponsePlugin from "@jspsych/plugin-video-keyboard-response";
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer"; 

interface TrialConfig {
    type: any;
    stimulus: string[];
    choices: string[];
    stimulus_width?: number;
    width?: number | string;
    height?: number | string;
    extensions?: any[];
    data: {
        path: string;
        trialType: "image" | "video";
    };
}

interface ExperimentTimeline {
    timeline: TrialConfig[];
    randomize_order: boolean;
}

export default function generateTrial(
    filePaths: string[], 
    typeFile: "img" | "video"
): ExperimentTimeline {
    const trialType = typeFile === "video" ? "video" : "image";
    
    const mediaPlugin = typeFile === "video" 
        ? VideoKeyboardResponsePlugin 
        : imageKeyboardResponse;
    
    const webgazerTarget = typeFile === "video"
        ? '#jspsych-video-keyboard-response-stimulus'
        : '#jspsych-image-keyboard-response-stimulus';

    const trials: TrialConfig[] = filePaths.map((path) => ({
        type: mediaPlugin,
        stimulus: [path],
        choices: [" "],
        stimulus_width: 1700,
        stimulus_height: 800,
        ...(typeFile === "video" && {
            width: 700,
            height: "auto"
        }),
        extensions: [{
            type: jsPsychExtensionWebgazer,
            params: { targets: [webgazerTarget] }
        }],
        data: {
            path,
            trialType
        }
    }));

    return {
        timeline: trials,
        randomize_order: true
    };
}