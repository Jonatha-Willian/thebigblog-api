import { Request } from "express";
import { User } from "../generated/prisma/client";
import { createJWT, readJWT } from "../libs/jwt";
import { tokenPayload } from "../types/token-payload";
import { getUserById } from "./userService";

export const createToken = (user: User) => {
    return createJWT({ id: user.id });
}

//Função para verificar o token JWT presente no header da requisição, ler o payload e buscar o usuário correspondente no banco de dados
export const verifyRequest = async (req: Request) => {
    const { authorization } = req.headers;
    if(authorization) {
        const authSplit = authorization.split('Bearer ');
        if(authSplit[1]) {
            const payload = readJWT(authSplit[1]);
            if(payload) {
                const userId = (payload as tokenPayload).id;
                const user = await getUserById(userId);
                if(user) {return user;}
            }
        }
    }
    return false;
}