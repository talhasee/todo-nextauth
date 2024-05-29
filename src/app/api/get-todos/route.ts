import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const _user = await userModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: {
                    path: "$todos",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    'todos.createdAt': -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    todos: {
                        $push: '$todos'
                    }
                }
            }
        ]);

        if(!_user || _user.length === 0){
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

        return Response.json(
            {
                success: true,
                todos: _user[0].todos
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("An unexpected error occured: ", error);
        return Response.json(
            {
                success: false,
                message: "Error in getting todos"
            },
            {
                status: 500
            }
        );
    }
}