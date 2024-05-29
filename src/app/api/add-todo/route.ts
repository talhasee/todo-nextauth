import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";
import { Todo } from "@/models/User.model";


export async function POST(request: Request) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;


    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        );
    }


    const {content} = await request.json();
    const email = user.email;

    try {
        const user = await userModel.findOne({
            email
        });

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            ); 
        }

        const newTodo = {content, createdAt: new Date()};

        user.todos.push(newTodo as Todo);

        await user.save();

        return Response.json(
            {
                success: true,
                message: "Todo added Successfully"
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error adding Todo ", error);
        return Response.json(
            {
                success: false,
                message: "Error adding Todo"
            },
            {
                status: 500
            }
        );
    }
}