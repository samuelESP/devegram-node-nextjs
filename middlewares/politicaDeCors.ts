import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { respostaPadraoMsg } from '../types/respostaPadraoMsg';
import NextCors from 'nextjs-cors';




export const politicaDeCors =  (handler: NextApiHandler) => 
    async (req:NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            
            await NextCors(req, res, {
                origin: '*',
                METHODS: ['POST', 'INPUT', 'GET'],
                optionsSuccessStatus: 200,
             });

             return handler(req, res);

        } catch (e) {
            console.log("Erro ao tratar a politica de CORS: ", e);
            return res.status(500).json({erro: "Eror ao tratar a politica de CORS"})
            
        }
    }
