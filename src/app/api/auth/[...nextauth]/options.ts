import { NextAuthOptions } from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";

export const authOptions: NextAuthOptions = {
    providers: [
       CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
            email: { label: "Email", type: "text"},
            password: {label: "Password", type: "password"}
        },

        async authorize(credentials: any): Promise<any> {
            
            await dbConnect();

            try {
                const user = await userModel.findOne({
                    email: credentials.identifier
                });

                if(!user){
                    throw new Error("No user found with this email");
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                if(isPasswordCorrect){
                    return user;
                }
                else{
                    throw new Error("Incorrect Password");
                }
            } catch (error: any) {
                throw new Error(error);
            }
        }
       }) 
    ],
    callbacks: {
        async session( {session, token} ){
            if(token){
                session.user._id = token._id;
                session.user.email = token.email;
            }

            return session;
        },

        async jwt( {token, user} ){
            if(user){
                token._id = user._id?.toString();
                token.email = user.email;
            }

            return token;
        },
    },

    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
}