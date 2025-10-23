import { jwtVerify } from "jose";

export const auth = async({token}:{token: string}): Promise<boolean> => { 
    try {
        console.log(token);
         await jwtVerify(token, new TextEncoder().encode(`${process.env.NETLIFY_EDGE_JWT_SECRET}`));
         return true
    } catch {
        return false
    }
}