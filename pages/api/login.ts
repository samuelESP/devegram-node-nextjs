import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'

import { conectaMongoDB } from "../../middlewares/conectaMongoDB"

const endPointLogin = (
    req: NextApiRequest,
    res: NextApiResponse <respostaPadraoMsg>
) => {
    if(req.method === "POST"){

        const {login, password} = req.body;

        if(login === "admin@admin.com" && password === "admin1234"){
            return res.status(200).json({msg: "Usuário autenticado com sucesso"})
        }
        return res.status(400).json({erro: "Usuário ou senha não encontrados"})

    }
    return res.status(405).json({erro: "Método informado não é válido"})
}

export default conectaMongoDB(endPointLogin)