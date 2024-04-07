import mongoose, {Schema} from "mongoose";


const userSchema = new Schema({
    nome: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    avatar: {type: String, require: false},
    followers: {type: Number, default: 0},
    following: {type: Number, default: 0},
    publications: {type: Number, default: 0},
});


// Primeiro vamos chegar se o model de user está criado
// Se não existir basta criar a tabela
// O nome do meu banco vai ser users, pois é nome que eu dei aqui no trecho abaixo
export const UserModel = (mongoose.models.users || mongoose.model('users', userSchema));