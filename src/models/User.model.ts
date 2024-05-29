import mongoose, { Document, Schema } from "mongoose";

/***************************************
                TODO SCHEMA
****************************************/


export interface Todo extends Document {
    _id: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date
}

const todoSchema: Schema<Todo>  = new Schema (
    {
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);


/***************************************
                USER SCHEMA
****************************************/

export interface User extends Document {
    email: string;
    password: string;
    todos: Todo[]
};

const UserSchema: Schema<User> = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        todos: [
            todoSchema
        ]
    }
);


const userModel = 
    (
        mongoose.models.User as mongoose.Model<User>
    )
    ||
    (
        mongoose.model<User>("User", UserSchema)
    )

export default userModel;
