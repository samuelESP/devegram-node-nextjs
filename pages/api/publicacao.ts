import { NextApiResponse} from 'next';
import type { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

import nc from "next-connect";
import { upload, uploadCosmicImagens } from '@/services/UploadCosmicImagens';

import {conectaMongoDB} from "../../middlewares/conectaMongoDB";
import {validarTokenJWT} from "../../middlewares/validarTokenJWT";

import {PublicacaoModel} from "../../models/PublicacaoModel";
import {UserModel} from "../../models/UserModel";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req:any, res:NextApiResponse<respostaPadraoMsg>) => {
        try {

            const {userId} = req.query;
            const usuario = await UserModel.findById(userId);
            
            if(!usuario){
                return res.status(400).json({erro: "Usuário não encontrado"})
            }

            if(!req || !req.body){
                return res.status(400).json({erro: "Parametros de entrada não informados"})
            }

            const {descricao} = req?.body;
            if(!descricao || descricao.length < 2){
                return res.status(400).json({erro: "Descrição não é valida"})
            }
            if(!req.file || !req.file.originalname){
                return res.status(400).json({erro: "Imagem é obrigatoria"})
            }

            const image = await uploadCosmicImagens(req);

            const publicacao = {
                idUser: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date()
            }

            await PublicacaoModel.create(publicacao);
            return res.status(200).json({msg: "Publicação criada com sucesso"})
            
        } catch (e) {
            console.log(e);
            return res.status(400).json({erro: "Erro ao cadastrar publicação"})
        }
    });

export const config = {
 api: {
    bodyParser: false
 }
}

export default validarTokenJWT((conectaMongoDB(handler)));