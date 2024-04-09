import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'

import { validarTokenJWT } from "../../middlewares/validarTokenJWT"

const endpointUsuario = 
(req: NextApiRequest, res: NextApiResponse <respostaPadraoMsg>) => {
 return res.status(200).json({msg: "Usário autenticado com sucesos"})
}

export default validarTokenJWT(endpointUsuario);