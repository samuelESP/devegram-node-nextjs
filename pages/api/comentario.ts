import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectaMongoDB } from '@/middlewares/conectaMongoDB';
import { UserModel } from '@/models/UserModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { politicaDeCors } from '@/middlewares/politicaDeCors';



const comentarioEndpoint = async (req:NextApiRequest, res:NextApiResponse<respostaPadraoMsg>) => {
    try {
        if(req.method === "PUT"){
            const {userId, idPublicacao} = req?.query;

            const usuarioLogado = await UserModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro: "Usuario não encontrado"})
            }

            const publicacao = await PublicacaoModel.findById(idPublicacao);
            if(!publicacao){
                return res.status(400).json({erro: "Publicacao não encontrada"})
            }
            
            if(!req.body || !req.body.comentario || req.body.comentario.length < 2){
                return res.status(400).json({erro: "Cometario inválido"})
            }
            const comentario = {
                usuarioId: usuarioLogado._id,
                nome: usuarioLogado.nome,
                cometario: req.body.comentario
            };

            publicacao.comentarios.push(comentario);
            await  PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);

            return res.status(200).json({ msg: "Comentário adicionado com sucesso" });
        }
        return res.status(405).json({erro: "Método informado inválido"})
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: "Ocorreu erro ao adicionar um comentário"})
    }
}

export default politicaDeCors(validarTokenJWT(conectaMongoDB(comentarioEndpoint)));