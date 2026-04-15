import { Request, Response, NextFunction } from 'express';
import { verifyRequest } from '../services/authService';
import { ExtendedRequest } from '../types/extended-request';

export const privateRoute =  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const user = await verifyRequest(req);
    if(!user) {
        res.status(401).json({ error: "Acesso Negado!" });
        return;
    }
    req.user = user;
    next();
}