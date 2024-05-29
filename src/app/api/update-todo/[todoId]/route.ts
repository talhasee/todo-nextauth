import dbConnect from "@/lib/dbConnect";
import userModel, { Todo } from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function PATCH(request: Request, {params}: {params: {todoId: string}}) {
    const todoId = params.todoId;
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

        const todo = user.todos.find(todo => todo._id.toString() === todoId);
      
        if(!todo){
            return Response.json(
                {
                    success: false,
                    message: "Todo not found"
                },
                {
                    status: 404
                }
            ); 
        }

        todo.content = content;
        await user.save();
        
        return Response.json(
            {
                success: true,
                message: "Todo updated Successfully"
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error updating Todo ", error);
        return Response.json(
            {
                success: false,
                message: "Error updating Todo"
            },
            {
                status: 500
            }
        );
    }
}