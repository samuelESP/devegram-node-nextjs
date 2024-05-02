import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';

import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import {conectaMongoDB} from "../../middlewares/conectaMongoDB"
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { UserModel } from '@/models/UserModel';
import { SeguidorModel } from '@/models/SeguidorModel';

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) => {
    try {
        if(req.method === "GET"){
            if(req?.query?.id){
            const usuario = await UserModel.findById(req?.query?.id);
                
                if(!usuario){
                    return res.status(400).json({erro: "Usuário não encontrado"})
                }
            
            const publicacoes = await PublicacaoModel.find({
                idUser : usuario._id}).sort({data: -1});
            return res.status(200).json(publicacoes);
            }else{
                
                const {userId} = req?.query;
                const usuarioLogado = await UserModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({erro: "Usuário Logado não encontrado"})
                }
                const seguidores = await SeguidorModel.find({usuarioId: usuarioLogado._id});

                const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId); 

                const publicacoes = await PublicacaoModel.find({
                    $or: [
                        {idUser: usuarioLogado._id,},
                        {idUser: seguidoresIds}
                    ]
                })
                .sort({data: -1});

                const result = [];
                for (const publicacao of publicacoes) {
                    const usuarioDaPublicacao = await UserModel.findById(publicacao.idUser);
                    if(usuarioDaPublicacao){
                        // ...publicacao -> vai criar um novo json copiando todo o json de "publicacao"
                        const final = {
                            ...publicacao._doc, usuario: {
                                nome: usuarioDaPublicacao.nome,
                                avatar: usuarioDaPublicacao.avatar
                            }};
                            
                            
                        result.push(final);
                        }
                }

                return res.status(200).json(result);
            }
        }
        return res.status(405).json({erro: "Método informado não válido"})
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({erro: "Não foi possível obter o feed"})
}

export default validarTokenJWT(conectaMongoDB(feedEndpoint));