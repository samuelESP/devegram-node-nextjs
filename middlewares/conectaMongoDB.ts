import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { respostaPadraoMsg } from '../types/respostaPadraoMsg';
import mongoose from 'mongoose';

export const conectaMongoDB = ( handler: NextApiHandler) => 
    async (req: NextApiRequest, res:NextApiResponse<respostaPadraoMsg> ) => {

        // verificar se o banco estiver conectado, se estiver seguir para o EndPoint ou proximo middleware
        if(mongoose.connections[0].readyState){
            return handler(req, res)
        }
        // Já que não esta conectado vamos conectar
        const {DB_CONEXAO_STRING} = process.env

        // Se a env estiver vazia, avisar ao programador e e abortar o uso do sistema
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro: "env de configuração do banco não informado" })
        }

        mongoose.connection.on('connected', () => console.log("Banco de dados conectado"));
        mongoose.connection.on('error', error => console.log(`ocorreu um erro ao conectar ao banco de dados: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        // Agora posso seguir para o meu endpoint, ja que meu banco esta conectado
        return handler(req, res)
    }