"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, FileEdit, Loader2 } from "lucide-react"
import { Todo } from "@/models/User.model"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import dayjs from 'dayjs';

import { apiResponse } from "@/types/apiResponse"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { todoSchema } from "@/schemas/todoSchema"
import * as z from "zod";
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"


type TodoCardProps = {
    todo: Todo;
    onTodoDelete: (todoId: string) => void;
    onTodoUpdate: (todoId: string, content: string) => void;
}

const TodoCard = ({todo, onTodoDelete, onTodoUpdate}: TodoCardProps) => {
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<z.infer<typeof todoSchema>>({
        resolver: zodResolver(todoSchema),
    });


    const handleDeleteConfirm = async () => {
        onTodoDelete(todo._id.toString());
        try {
            
            const response = await axios.delete<apiResponse>(`/api/delete-todo/${todo._id.toString()}`)
            
            toast({
                title: response.data.message
            });

        }catch(error){
            console.error(`Error in deleting Todo - ${error}`);
        }
    }


    const todoContent = form.watch('content');

    const onSubmit = async(data: z.infer<typeof todoSchema> ) => {
        setIsLoading(true);
        onTodoUpdate(todo._id.toString(), todoContent);

        try {
            const response = await axios.patch<apiResponse>(`/api/update-todo/${todo._id.toString()}`,{
                ...data,
            })
            toast({
                title: response.data.message
            });
            form.reset({...form.getValues(), content: ''});

        } catch (error) {
            console.error(`Error in updating Todo - ${error}`);
        }
        finally{
            setIsLoading(false);
        }
    }

    const doNothing = () => {

    }


    return (
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{todo.content}</CardTitle>
                    <div className="flex flex-col space-y-5">
                    <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="secondary" className="bg-gray-400"><FileEdit className="w-5 h-5"/></Button>
                                
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Update Your Todo</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Update todo description
                                                </FormLabel>
                                                <FormControl>
                                                <Textarea
                                                    placeholder="Todo content"
                                                    className="resise-none"
                                                    {...field}
                                                />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}  
                                        />
                                        <div className="flex justify-center">
                                            {
                                            isLoading ? (
                                                <Button disabled>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                Please wait
                                                </Button>
                                            ) : (
                                                <Button type="submit" disabled = {isLoading || !todoContent}>
                                                Update
                                                </Button>
                                            )
                                            }
                                        </div>
                                        </form>
                                    </Form>
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                                {/* <AlertDialogAction onClick={doNothing}>OK</AlertDialogAction> */}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive"><X className="w-5 h-5"/></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this Todo
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                       
                    </div>
                </div>
            </CardHeader>
            <CardContent className="text-sm">
                {dayjs(todo.createdAt).format('MMM D, YYYY h:mm A')}
            </CardContent>
        </Card>
    )
}

export default TodoCard;