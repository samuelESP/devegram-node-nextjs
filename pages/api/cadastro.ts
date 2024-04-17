import {NextApiResponse, NextApiRequest} from "next";
import type {CadastroRequisicao} from "../../types/CadastroRequisicao";
import {conectaMongoDB} from "../../middlewares/conectaMongoDB";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import {UserModel} from "../../models/UserModel";
import md5 from 'md5';
import {upload, uploadCosmicImagens} from "../../services/UploadCosmicImagens"
import nc from "next-connect";

const handler = nc()
    .use(upload.single("file"))
    .post(async (req: NextApiRequest, res:NextApiResponse<respostaPadraoMsg>) => {
    try {
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
    // validação, se já existe user com o mesmo email
        const usersWithSameEmail = await UserModel.find({email: user.email})
            if(usersWithSameEmail && usersWithSameEmail.length > 0){
            if(usersWithSameEmail && usersWithSameEmail.length > 0){
            return res.status(400).json({erro: "Usuário já existente"})
            }
            
        // Enviar a imagen do multer que já foi processada, para o cosmic
        const image = await uploadCosmicImagens(req); 
            }
            
        // Enviar a imagen do multer que já foi processada, para o cosmic
        const image = await uploadCosmicImagens(req); 
        // Salvar no banco de dados
        const userCriptografado = {
            nome: user.nome,
            email: user.email,
            password: md5(user.password),
            avatar: image?.media?.url
        }
        await UserModel.create(userCriptografado)
        return res.status(200).json({msg: "Usuario criado com sucesso"})
    }catch (e) {  
        console.log(`${e}`);
        
        return res.status(500).json({erro: `Erro ao cadastrar usuário`})
        
    }})
// Configurando para que o NEXT não mande uma request com um JSON, por estarmos enviando uma foto é necessário que seja um FormData
export const config = { 
    api: {
      bodyParser: false,
    },
  };


export default conectaMongoDB(handler);