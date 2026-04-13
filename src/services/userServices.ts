import bcrypt from "bcryptjs";
import { prisma } from "../libs/prisma";
import { email } from "zod";

type CreateUserProps = {
    name: string;
    email: string;
    password: string;
}

export const createUser = async ({ name, email, password }: CreateUserProps) => {
    email = email.toLowerCase();
    const user = await prisma.user.findFirst({
        where: { email }
    })
    if(user) {
        return false;
    }

    const newPassword = await bcrypt.hashSync(password, 10);

    return await prisma.user.create({
        data: { name, email, password: newPassword }
    });
}
type verifyUserProps = {
    email: string;
    password: string;
}
export const verifyUser = async ({email, password}: verifyUserProps) => {
    email = email.toLowerCase();
    const user = await prisma.user.findFirst({ where: { email } });
    if(!user) { return false; }
    if(!bcrypt.compareSync(password, user.password)) { return false; }

    return user;
}