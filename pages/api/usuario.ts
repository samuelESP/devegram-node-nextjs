import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';

import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import {conectaMongoDB} from "../../middlewares/conectaMongoDB"
import { UserModel } from '@/models/UserModel';
import nc from "next-connect";
import {upload, uploadCosmicImagens} from "../../services/UploadCosmicImagens"
import { politicaDeCors } from '@/middlewares/politicaDeCors';

const handler = nc()
    .use(upload.single("file"))
    .put(async (req: any, res: NextApiResponse <respostaPadraoMsg>) => {
        
        try {
            const {userId} = req?.query;
            const usuario = await UserModel.findById(userId);
            
            
            if(!usuario) {
            return res.status(400).json({erro: "Usuário não encontrado"})
            }
            const {nome} = req.body;
            if(nome && nome.length> 2){
                usuario.nome = nome;
            }
            const {file} = req;
            if(file && file.originalname){
                const image = await uploadCosmicImagens(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = file;
                }
            }

            await UserModel.findByIdAndUpdate({_id: usuario.id}, usuario);
            return res.status(200).json({msg: "Usuário alterado com sucesso"});


        } catch (e) {
            console.log(e);
            return res.status(400).json({erro: "Não foi possível atualizar usuário"+ e})
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse <respostaPadraoMsg | any>) => {
    
        try {
            const {userId} = req?.query;
            const usuario = await UserModel.findById(userId);
            usuario.password = null;
            return res.status(200).json(usuario);
        } catch (e) {
            console.log(e);
        }
        return res.status(400).json({erro: "Não foi possível obter dados do usuário"})
    });

    export const config = {
        api: {
           bodyParser: false
        }
       }
 
export default politicaDeCors(validarTokenJWT(conectaMongoDB(handler)));