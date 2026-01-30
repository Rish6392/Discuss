import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";

import { prisma } from "@/lib";

if(!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET){
    throw new Error('Missing github client id or client secret');
}

export const {handlers:{GET,POST},auth,signIn,signOut}=NextAuth({
    adapter:PrismaAdapter(prisma),
    // Support both Auth.js v5 and legacy env names
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    providers:[
        GitHubProvider({
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET
        })
    ],
    callbacks:{
        async session({user,session}){
           if(session && user){
            session.user.id = user.id
           }
           return session;
        }
    }
})