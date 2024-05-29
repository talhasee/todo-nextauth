import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import userModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from 'next-auth';

export async function DELETE(request: Request, {params}: {params: {todoId: string}}){
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

    try {
        const updatedResult = await userModel.updateOne(
            {
                _id: user._id
            },
            {
                $pull: {
                    todos: {
                        _id: todoId
                    }
                }
            }
        );

        if(updatedResult.modifiedCount == 0){
            return Response.json(
                {
                    success: false,
                    message: "Todo Not found or already Deleted"
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Todo Deleted"
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error(`Error in deleting Todo - ${error}`);
        return Response.json(
            {
                success: false,
                message: "Error deleting Todo"
            },
            {
                status: 500
            }
        )
    }
}