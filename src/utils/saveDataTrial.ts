import { JsPsych } from "jspsych";

export async function saveDataTrial(jsPsych: JsPsych) {
    const data = jsPsych.data.get();

    const dataJson = JSON.stringify(data);

    try {
        const response = await fetch('/api/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataJson,
        });

        if (response.ok) {
            console.log('Dados salvos com sucesso!');
        } else {
            console.error('Erro ao salvar os dados:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
    }
}