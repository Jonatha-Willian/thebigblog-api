import { RequestHandler, Response} from "express"
import { ExtendedRequest } from "../types/extended-request"
import { z } from "zod";
import { createPost, createPostSlug, handleCover } from "../services/postService";
import { getUserById } from "../services/userService";
import {coverToUrl} from "../utils/cover-to-url";

export const addPost: RequestHandler = async (req: ExtendedRequest, res: Response) => {
    if(!req.user){ return; }

    const schema = z.object({
        title: z.string(),
        tags: z.string(),
        body: z.string()
    });
    const data = schema.safeParse(req.body);
    if(!data.success){
        return res.json({ error: data.error.flatten().fieldErrors });
    }
    if(!req.file){
        return res.json({ error: "Sem arquivo de capa!"});
    }

   // lidar com arquivo (verificações, mover para pasta definitiva, etc)
    const coverName = await handleCover(req.file as Express.Multer.File);
    if(!coverName){
        return res.json({ error: "Arquivo de capa inválido ou não enviado!"});
    }
    //Criar slug do post
    const slug = await createPostSlug(data.data!.title);
    // Criar o post
    const newPost = await createPost({
        authorId: req.user!.id,
        slug,
        title: data.data!.title,
        tags: data.data!.tags,
        body: data.data!.body,
        cover: coverName as string
    });
    // Pegar user do req.user e associar ao post
    const author = await getUserById(newPost.authorId);
    // Fazer retorno segundo o resultado (sucesso ou erro) 
    res.status(201).json({
        post: {
            id: newPost.id,
            slug: newPost.slug,
            title: newPost.title,
            createdAt: newPost.createdAt,
            cover: coverToUrl(newPost.cover),
            tags: newPost.tags,
            authorname: author?.name
        }
    });
}

export const getPosts: RequestHandler = async (req, res) => {
    
}
export const getPost: RequestHandler = async (req, res) => {
    
}
export const editPost: RequestHandler = async (req, res) => {
    
}
export const removePost: RequestHandler = async (req, res) => {
    
}