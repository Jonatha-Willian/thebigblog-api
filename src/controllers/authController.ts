import { RequestHandler } from "express"
import { z } from "zod";
import { createUser, verifyUser } from "../services/userServices";
import { createToken } from "../services/authServices";

export const signup: RequestHandler =  async (req, res) => {
    const schema = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string().min(4)
    });
    const data = schema.safeParse(req.body);
    if(!data.success) {
        return res.status(400).json({ error: data.error.flatten().fieldErrors});
    }
    const newUser = await createUser(data.data);
    if(!newUser) {
        return res.status(400).json({ error: "Erro ao criar usuário" });
    }
    const token = createToken(newUser);

    res.status(201).json({ user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
        },
        token 
    });
}

export const signin: RequestHandler = async (req, res) => {
    const schema = z.object({
        email: z.string(),
        password: z.string()
    });
    const data = schema.safeParse(req.body);
    if(!data.success) {
        res.json({ error: data.error.flatten().fieldErrors });
        return;
    }
    const user = await verifyUser(data.data);
    if(!user) {
        res.json({ error: "Email ou senha inválidos" });
        return;
    }
    const token = createToken(user);
    res.json({ user: {
        id: user.id,
        name: user.name,
        email: user.email
    }, token });
}

export const validate: RequestHandler = (req, res) => {

} 