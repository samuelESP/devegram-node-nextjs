This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# validarToken

## Validar a chave e acesso
```ts
const {MINHA_CHAVE_JWT} = process.env;

    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro: `ENV de chave JWT não informada na execução do processo`})
    }
```

## Validar se veio algum header

Pois, precisa ter pelo menos um header, que é o de autorização que vai passar o meu token Bearer

```ts
if(!res || !req.headers){
        return res.status(401).json({erro: `Não foi possível validar o token de acesso`})
    }
```

## Validou se veio o OPTION 

O navegador vai fazer um **OPTIONS** como padrão, antes mesmo de fazer o **POST**. 
E o **OPTIONS** não manda executar o serviço, só cola as informações do serviço, ele busca quais são os headers obrigatorios e precisa passar.
Logo, vale a pena quando for o **OPTIONS**, mandar ele seguir em frente, pois, talvez não tenha passado o header ainda.
So precisamos do header no **POST** mesmo

```ts
if(req.method !== "OPTIONS"){
    ...
}
```

## Validar se veio o header de autorização e o token

```ts
 const authorization = req.headers['authorization'];
        if(!authorization){
            return res.status(401).json({erro: `Não foi possível validar o token de acesso`})
        }
        const token = authorization.substring(7);
        // substring(7), pois o meu token em si so vem depois de 6 caracteres: Bearer _Token_
        if(!token){
            return res.status(401).json({erro: `Não foi possível validar o token de acesso`})
        }
```

## Verificar a chave

usa a função do proprio jwt(*verify*) para verificar meu token com a minha chave
se der certo vai voltar o objeto, caso contrário vai dar erro;
Caso volte o objeto vai ser checado se tme uma query na requisição;
E por fim, adiciona na query nosso usuário.

```ts
const decoded = await jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
if(!decoded){
    return res.status(401).json({erro: `Não foi possível validar o token de acesso`})
}
if(!req.query){
    req.query= {};
}
req.query.userId = decoded._id;
        
```


