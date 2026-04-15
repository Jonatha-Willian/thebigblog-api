import jwt from "jsonwebtoken";
import { hash } from "node:crypto";
//Criando um token JWT com o payload e a chave secreta definida no arquivo .env
//a funcção sing do jwt é usada para criar o token, passando o payload e a chave secreta como argumentos
export const createJWT = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_KEY as string);
}

//Lendo e verificando um token JWT usando a função verify do jwt, passando o token e a chave secreta como argumentos
export const readJWT = (hash: string) => {
    try {
        return jwt.verify(
            hash,
            process.env.JWT_KEY as string
        );
    } catch (error) {
        return false;
    }
}