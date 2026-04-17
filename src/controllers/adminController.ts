import { RequestHandler, Response} from "express"
import { ExtendedRequest } from "../types/extended-request"
import { z } from "zod";
import { createPost, createPostSlug, deletePost, getPostBySlug, handleCover, updatePost } from "../services/postService";
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
export const editPost: RequestHandler = async (req: ExtendedRequest, res: Response) => {
    // Pegar slug do req.params
    const { slug } = req.params;
    // Validar body com Zod (todos os campos opcionais)
    const schema = z.object({
        status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
        title: z.string().optional(),
        tags: z.string().optional(),
        body: z.string().optional()
    });
    const data = schema.safeParse(req.body);
    if(!data.success){
        return res.json({ error: data.error.flatten().fieldErrors });
    }
    // Verificar se post existe (pelo slug)
    const post = await getPostBySlug(slug as string);
    if(!post){
        return res.json({ error: "Post não encontrado!" });
    }
    // Se tiver arquivo, lidar com ele (verificações, mover para pasta definitiva, etc)
    let coverName: string | false = false;
    if(req.file){
        coverName = await handleCover(req.file);
    }
    // Atualizar post com os dados do body (e do arquivo, se tiver)
    const updatedPost = await updatePost(slug as string, {
        updatedAt: new Date(),
        status: data.data.status ?? undefined,
        title: data.data.title ?? undefined,
        tags: data.data.tags ?? undefined,
        body: data.data.body ?? undefined,
        cover: coverName ? coverName : undefined
    });
    // Fazer retorno segundo o resultado (sucesso ou erro)
    const author = await getUserById(updatedPost.authorId);
    res.json({
        post: {
            id: updatedPost.id,
            status: updatedPost.status,
            slug: updatedPost.slug,
            title: updatedPost.title,
            createdAt: updatedPost.createdAt,
            cover: coverToUrl(updatedPost.cover),
            tags: updatedPost.tags,
            authorname: author?.name
        }
    });
}

export const removePost = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;
    const post = await getPostBySlug(slug as string);
    if(!post){
        return res.json({ error: "Post não encontrado!" });
    }
    await deletePost(slug as string);
    res.json({ message: "Post removido com sucesso!" });
}