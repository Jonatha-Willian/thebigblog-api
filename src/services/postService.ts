import { v4 } from "uuid";
import fs from "fs/promises";
import slug from "slug";
import { prisma } from "../libs/prisma";
import { Prisma } from "../generated/prisma/client";

export const getPostBySlug = async (slug: string) => {
    return await prisma.post.findUnique({
        where: { slug },
        include:{
            User: {
                select: {
                    name: true,
                }
            }
        }
    });
}

export const handleCover = async (file: Express.Multer.File) => {
    
    // Verificar tipo do arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/png"];
    if(allowedTypes.includes(file.mimetype)){
        // Gerar nome único para o arquivo
        const coverName = `${v4()}.jpg`;
        try {
            // Mover o arquivo para a pasta definitiva
            // o fs do Node.js tem uma função rename que pode ser usada para mover arquivos
            // promises do fs, então usamos await para esperar a operação ser concluída
            await fs.rename(
                //file.path é o caminho do arquivo temporário criado pelo multer
                file.path,
                `public/images/covers/${coverName}`
            );
        } catch (error) {
            return false;
        }
        return coverName;       
    }
    return false;
}

export const createPostSlug = async (title: string) => {
    let newSlug = slug(title.toLowerCase());
    // Verificar se o slug já existe no banco de dados
    let keepChecking = true;
    let suffix = 1;
        while(keepChecking){
            const post = await getPostBySlug(newSlug); // Função fictícia para buscar post por slug
            if(!post){
                // Se o slug não existe, podemos usá-lo e parar de verificar
                keepChecking = false;
            } else {
                // Se o slug já existe, adicionar um sufixo numérico e verificar novamente
                // Exemplo: "meu-post" -> "meu-post-1", "meu-post-2", etc
                newSlug = `${slug(title.toLowerCase())}-${++suffix}`;    
            }
        }
    return newSlug;
}
type CreatePostProps = {
    authorId: number;
    slug: string;
    title: string;
    tags: string;
    body: string;
    cover: string;
}

export const createPost = async (data: CreatePostProps) => {
    return await prisma.post.create({ data});
}
// o Prisma.PostUpdateInput é um tipo gerado automaticamente pelo Prisma, 
// que representa os campos que podem ser atualizados em um post. 
// Ele é baseado no modelo de dados definido no schema.prisma e inclui todos os campos do post, 
// mas todos eles são opcionais, já que em uma atualização nem todos os campos precisam ser fornecidos.
export const updatePost = async (slug: string, data: Prisma.PostUpdateInput) => {
    return await prisma.post.update({
        where: { slug },
        data
    });
}

export const deletePost = async (slug: string) => {
    return await prisma.post.delete({
        where: { slug }         
    });
}
