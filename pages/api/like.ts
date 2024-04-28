import {NextApiResponse, NextApiRequest} from "next";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectaMongoDB } from "@/middlewares/conectaMongoDB";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UserModel } from "@/models/UserModel";


const likeEndpoint = async (req:NextApiRequest, res:NextApiResponse<respostaPadraoMsg>) => {

    try {
        
    if(req.method === "PUT"){

        const{idPublicacao} = req?.query;
        const publicacao = await PublicacaoModel.findById(idPublicacao);
        if(!publicacao){
            return res.status(400).json({erro: "Publicação não encontrada"})
        }

        const{userId} = req?.query;
        const usuario = await UserModel.findById(userId);
        if(!usuario){
            return res.status(400).json({erro: "Usuário não encontrado"})
        }

        const indexUserOnLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());
        if(indexUserOnLike != -1){
            publicacao.likes.splice(indexUserOnLike, 1);
            await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
            return res.status(200).json({msg: "unLike"})
        }else{
            publicacao.likes.push(usuario._id);
            await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
            return res.status(200).json({msg: "Like"})
        }

    }

    return res.status(405).json({erro: "Método não válido"})
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: "ocorreu o erro a curtir/descurtir uma publicação"})
    }

}

export default validarTokenJWT(conectaMongoDB(likeEndpoint));