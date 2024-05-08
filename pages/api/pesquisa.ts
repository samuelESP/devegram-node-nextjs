import { NextApiRequest, NextApiResponse } from "next";
import { respostaPadraoMsg } from "@/types/respostaPadraoMsg";


import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectaMongoDB } from "@/middlewares/conectaMongoDB";
import { UserModel } from "@/models/UserModel";
import { politicaDeCors } from "@/middlewares/politicaDeCors";

const pesquisaEndPoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any[]>) => {


    try {
        if(req.method === "GET"){
        
            if(req?.query?.id){
                const usuarioEncontrado = await UserModel.findById(req?.query?.id);
                if(!usuarioEncontrado){
                    return res.status(400).json({erro: "Usuário não encontrado"})
                }
                
                usuarioEncontrado.password = null;
                return res.status(200).json(usuarioEncontrado)
            }else{
                const {filtro} = req.query;
                if(!filtro || filtro.length < 2){
                    return res.status(400).json({erro: "Favor informar pelo menos 2 caracteres para a busca de usuarios"})
                }
                const usuariosEncontrados = await UserModel.find({
                    $or :[{nome: {$regex : filtro, $options: 'i'}},
                        {email:{$regex : filtro, $options: 'i'}}]
                    
                })
                usuariosEncontrados.forEach(userFound => {
                    userFound.password = null
                });
                return res.status(200).json(usuariosEncontrados)
            }
        }
        return res.status(405).json({erro: "Método informado não é válido"})
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: "Não foi possível buscar usuários em nosso banco" + e})
    }
}

export default politicaDeCors(validarTokenJWT(conectaMongoDB(pesquisaEndPoint))) ;