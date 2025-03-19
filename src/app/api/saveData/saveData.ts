import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const data = req.body;

            const filePath = path.join(process.cwd(), 'data', 'trialData.json');

            if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
                fs.mkdirSync(path.join(process.cwd(), 'data'));
            }

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

            res.status(200).json({ message: 'Dados salvos com sucesso!' });
        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
            res.status(500).json({ message: 'Erro ao salvar os dados' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}