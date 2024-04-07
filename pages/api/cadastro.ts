import {NextApiResponse, NextApiRequest} from "next";
import type {CadastroRequisicao} from "../../types/CadastroRequisicao";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";


const  endpointCadastro = (req: NextApiRequest, res:NextApiResponse<respostaPadraoMsg>) => {

    if(req.method === "POST"){
        const user = req.body as CadastroRequisicao;

        if(!user.nome || user.nome.length < 2){
            return res.status(400).json({erro: "Nome inválido"})
        }
        if(!user.email || user.email.length < 5 || !user.email.includes('@') || !user.email.includes('.')){
            return res.status(400).json({erro: "email inválido"})
        }
        if(!user.password || user.password.length < 4){
            return res.status(400).json({erro: "senha inválido"})
        }
        return res.status(200).json({msg: "Dados Corretos"})
    }
    return res.status(405).json({erro: "Método informado não é válido"})
}

export default endpointCadastro;