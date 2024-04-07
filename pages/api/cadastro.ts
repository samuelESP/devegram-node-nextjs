import {NextApiResponse, NextApiRequest} from "next";
import type {CadastroRequisicao} from "../../types/CadastroRequisicao";
import {conectaMongoDB} from "../../middlewares/conectaMongoDB";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import {UserModel} from "../../models/UserModel";
import md5 from 'md5';


const  endpointCadastro = 
async (req: NextApiRequest, res:NextApiResponse<respostaPadraoMsg>) => {
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
        // validação, se já existe user com o mesmo email
        const usersWithSameEmail = await UserModel.find({email: user.email})
        if(usersWithSameEmail && usersWithSameEmail.length > 0){
            return res.status(400).json({erro: "Usuário já existente"})
        }
        // Salvar no banco de dados
        const userCriptografado = {
            nome: user.nome,
            email: user.email,
            password: md5(user.password)
        }
        await UserModel.create(userCriptografado)
        return res.status(200).json({msg: "Usuario criado com sucesso"})
    }
    return res.status(405).json({erro: "Método informado não é válido"})
}

export default conectaMongoDB(endpointCadastro);