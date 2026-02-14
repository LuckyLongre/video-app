import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and Password required!" },
                { status: 400 }
            );
        }

        await connectDB()

        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json(
                { error: "User Already exits!" },
                { status: 400 }
            );
        }

        await User.create({ email, password })

        return NextResponse.json(
            { message: "User registered successfully." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Registraction Error", error);

        return NextResponse.json(
            { error: "Failed to registration!" },
            { status: 400 }
        );
    }
}
