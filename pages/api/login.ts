import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'

import { conectaMongoDB } from "../../middlewares/conectaMongoDB"

import md5 from 'md5';
import { UserModel } from '@/models/UserModel';

const endPointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse <respostaPadraoMsg>
) => {
    if(req.method === "POST"){

        const {login, password} = req.body;

        const usersFounders = await UserModel.find({email: login, password: md5(password)})
        if(usersFounders && usersFounders.length > 0){
            const userFound = usersFounders[0];
            return res.status(200).json({msg: `Usuário..: ${userFound.nome} autenticado com sucesso`})
        }
        return res.status(400).json({erro: "Usuário ou senha não encontrados"})

    }
    return res.status(405).json({erro: "Método informado não é válido"})
}

export default conectaMongoDB(endPointLogin)