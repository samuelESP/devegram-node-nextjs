import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import type { LoginResposta } from '../../types/LoginResposta'

import { conectaMongoDB } from "../../middlewares/conectaMongoDB"

import md5 from 'md5';
import { UserModel } from '@/models/UserModel';
import jwt from 'jsonwebtoken';

const endPointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse <respostaPadraoMsg | LoginResposta>
) => {

    const{MINHA_CHAVE_JWT}= process.env;

    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro: "ENV JWT não informado"})
    }

    if(req.method === "POST"){

        const {login, password} = req.body;

        const usersFounders = await UserModel.find({email: login, password: md5(password)})
        if(usersFounders && usersFounders.length > 0){
            const userFound = usersFounders[0];


            const token = jwt.sign({id: userFound._id}, MINHA_CHAVE_JWT);

            return res.status(200).json({
                nome: userFound.nome, 
                email: userFound.email, 
                token})
        }

        return res.status(400).json({erro: "Usuário ou senha não encontrados"})

    }
    return res.status(405).json({erro: "Método informado não é válido"})
}

export default conectaMongoDB(endPointLogin)