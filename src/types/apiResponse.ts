import { Todo } from "@/models/User.model";

export interface apiResponse{
    success: boolean;
    message: string;
    todos?: Array<Todo>
}