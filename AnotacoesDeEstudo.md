# handler:

Em Next.js, um "handler" ou "NextApiHandler" é uma função responsável por lidar com uma rota de API (Application Programming Interface). 
Em outras palavras, é uma função que define o comportamento da sua API em uma aplicação Next.js.

# mongoose: 
é o módulo do Node.js que permite interagir com bancos de dados MongoDB de forma assíncrona.

# connections: é uma propriedade de mongoose que contém um array de todas as conexões abertas atualmente.

## [0]: acessa o primeiro elemento do array de conexões. Em aplicações simples, pode haver apenas uma conexão e, portanto, estamos acessando a primeira (índice 0).
# readyState: é uma propriedade que indica o estado atual da conexão. Ela pode ter os seguintes valores:
0: desconectado
1: conectando
2: conectado
3: desconectando


Portanto, **mongoose.connections[0].readyState** retorna o estado atual da primeira conexão do Mongoose com o MongoDB. 
Isso pode ser útil para verificar se a conexão está estabelecida antes de executar determinadas operações no banco de dados. 
Por exemplo, você pode querer esperar até que a conexão esteja totalmente estabelecida antes de iniciar o servidor da sua aplicação.


# mongoose.connection.on: 
Isso registra um ouvinte de eventos na conexão do Mongoose.

# 'connected': 
Este é o evento que estamos ouvindo. Ele é disparado quando a conexão com o banco de dados é estabelecida com sucesso.

# Cadastrando um usuário;

Antes de qualquer coisa é interessante eu saber oque o meu user vai necessitar para ser cadastrado dentro do banco de daodos.
No caso, vamos necessitar de nome, email e password.
Vamos então criar esse itens na pasta types:

```ts
export type CadastroRequisicao = {
    nome: string,
    email: string,
    password: string
}
```

## Arquivo dentro do API

Este arquivo tem pouca diferença do meu login, ele vai verificar a minha entrada de dados, vai conectar no meu Schema e passar pelo middleware.

## Schema

o meu Schema vai ser responsavel por cirar meu usuário dentro da meu banco de dados:

```ts
export const UserModel = (mongoose.models.users || mongoose.model('users', userSchema));
```
Se já existir o **users** ele vai utilizar, se não existe ele vai criar.

# md5

Ele cria uma criptografia por cima de meus dados
logo, ao inves de eu mandar o meu user eu mando o meu userCriptografado

# Validando email

se pode usar ainda um trecho de código para validar meu email, proibindo a criação de 2 user com o mesmo email:

```ts
const usersWithSameEmail = await UserModel.find({email: user.email})
        if(usersWithSameEmail && usersWithSameEmail.length > 0){
            return res.status(400).json({erro: "Usuário já existente"})
        }
```
Se ele encontrar dentro do meu banco um email, com o mesmo que está sendo passado(**user.email**), ele vai travar a minha requisição

# Passando o meu usuario correto para o Login

Vamos usar o find do mesmo jeito que foi usado acima.
Primeiro vamos procurar se tem um usuário no banco de dados:
```ts
const usersFounders = await UserModel.find({email: login, password: md5(password)})
```

depois criamos um if, para verificar se dentro dessa minha constante encontramos um user:
```ts
 if(usersFounders && usersFounders.length > 0){
            ...
        }
```

E por último retornamos a menssagem:
```ts
    const userFound = usersFounders[0];
    return res.status(200).json({msg: `Usuário..: ${userFound.nome} autenticado com sucesso`})
```