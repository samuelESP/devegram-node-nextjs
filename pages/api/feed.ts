import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';

import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import {conectaMongoDB} from "../../middlewares/conectaMongoDB"
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { UserModel } from '@/models/UserModel';

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) => {
    try {
        if(req.method === "GET"){
            if(req?.query?.userId){
            const usuario = await UserModel.findById(req?.query?.userId);
                
                if(!usuario){
                    return res.status(400).json({erro: "Usuário não encontrado"})
                }
            
            const publicacoes = await PublicacaoModel.find({
                idUser : usuario._id}).sort({data: -1});
            return res.status(200).json(publicacoes);
            }
        }
        return res.status(405).json({erro: "Método informado não válido"})
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({erro: "Não foi possível obter o feed"})
}

export default validarTokenJWT(conectaMongoDB(feedEndpoint));