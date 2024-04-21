import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';

import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import {conectaMongoDB} from "../../middlewares/conectaMongoDB"
import { UserModel } from '@/models/UserModel';

const endpointUsuario = 
async (req: NextApiRequest, res: NextApiResponse <respostaPadraoMsg | any>) => {
    
    try {
        const {userId} = req?.query;
        const usuario = await UserModel.findById(userId);
        usuario.password = null;
        return res.status(200).json(usuario);
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({erro: "Não foi possível obter dados do usuário"})
}

export default validarTokenJWT(conectaMongoDB(endpointUsuario));