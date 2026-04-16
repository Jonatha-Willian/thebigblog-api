import { Request } from "express";
import { User } from "../generated/prisma/client";

type UserWithoutPassword = Omit<User, "password">;

export type ExtendedRequest = Request & {
    user?: UserWithoutPassword;
};