import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectaMongoDB } from '@/middlewares/conectaMongoDB';
import {SeguidorModel} from "../../models/SeguidorModel";
import { UserModel } from '@/models/UserModel';
import { politicaDeCors } from '@/middlewares/politicaDeCors';


const seguirEndpoint = async (req:NextApiRequest, res:NextApiResponse<respostaPadraoMsg>) => {
    try {

        if(req.method === "PUT"){

            const {userId, id} = req?.query;

            const usuarioLogado = await UserModel.findById(userId);
            console.log(usuarioLogado._id);
            
            if(!usuarioLogado){
                return res.status(400).json({erro: "Usuário logado não encontrado"})
            }
            
            const usuarioASerSeguido = await UserModel.findById(id);
            console.log(usuarioASerSeguido._id);
            if(!usuarioASerSeguido){
                return res.status(400).json({erro: "Usuário a ser seguido não encontrado"})
            }

            const jaEUmseguidor = await SeguidorModel.find({usuarioId : usuarioLogado._id ,usuarioSeguidoId: usuarioASerSeguido._id});
            
            
            
            if(jaEUmseguidor && jaEUmseguidor.length > 0){
                
                jaEUmseguidor.forEach( async (e: any) => await SeguidorModel.findByIdAndDelete({_id: e._id}));

                usuarioLogado.following--;
                await UserModel.findByIdAndUpdate({_id: usuarioLogado._id},usuarioLogado);

                usuarioASerSeguido.followers--;
                await UserModel.findByIdAndUpdate({_id: usuarioASerSeguido._id},usuarioASerSeguido);

                return res.status(200).json({msg: "Deixou de seguir o usuário com sucesso"})

            }else{
                const seguidor = {
                    
                    usuarioId: usuarioLogado._id,
                    usuarioSeguidoId: usuarioASerSeguido._id,
                };
                console.log(seguidor.usuarioId);
                
                await SeguidorModel.create(seguidor);

                usuarioLogado.following++;
                await UserModel.findByIdAndUpdate({_id: usuarioLogado._id},usuarioLogado);

                usuarioASerSeguido.followers++;
                await UserModel.findByIdAndUpdate({_id: usuarioASerSeguido._id},usuarioASerSeguido);

                return res.status(200).json({msg: "Usuário seguido com sucesso"})
            }

        }

        return res.status(405).json({erro: "Método não válido"})
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: "Não foi possível seguir/deseguir o usuário informado"})
    }
}

export default politicaDeCors(validarTokenJWT(conectaMongoDB(seguirEndpoint)));
    
