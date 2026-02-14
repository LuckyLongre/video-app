import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./db";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { lable: "Email", type: "email" },
                password: { lable: "password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("email and pasword is missing!")
                }

                try {
                    await connectDB()
                    const user = await User.findOne({ email: credentials.email })

                    if (!user) {
                        throw new Error("email or password is wrong!")
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password)

                    if (!isValid) {
                        throw new Error("email or pasword is wrong!")
                    }

                    return {
                        id: user._id.toString(),
                        emai: user.emai
                    }
                } catch (error) {
                    console.error("Auth Error", error);
                    throw error
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    }
}