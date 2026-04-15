import { Request } from "express";
import { User } from "../generated/prisma/client";
// Criando um tipo que representa o usuário sem a senha, 
// usando o Omit para excluir a propriedade "password" do tipo User
type UserWithoutPassword = Omit<User, "password">;
// Criando um tipo que estende o tipo Request do Express,
// adicionando a propriedade "user" do tipo UserWithoutPassword
// & = interseção de tipos, para combinar as propriedades do Request com a nova propriedade user
// ? = opcional, pois nem todas as requisições terão um usuário autenticado
export type ExtendedRequest = Request & {
    user?: UserWithoutPassword;
};