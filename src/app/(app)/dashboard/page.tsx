'use client'

import DashboardSkeleton from "@/components/DashboardSkeleton"
import TodoCard from "@/components/TodoCard"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Todo } from "@/models/User.model";
import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { todoSchema } from "@/schemas/todoSchema";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";



const Dashboard = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const {toast} = useToast();

    const handleDeleteTodo = (todoId: string) => {
        setTodos(todos.filter((todo) => todo._id.toString() !== todoId));
    }

    const handleUpdateTodo = (todoId: string, content: string) => {
      setTodos(todos.map((todo) => 
          todo._id.toString() === todoId 
              ? {
                  ...todo,
                  content: content
                } as Todo 
              : todo
      ));
    }
  
  
    const {data: session, status} = useSession();

    const userSessionFetching = status === "loading";

    const form = useForm<z.infer<typeof todoSchema>>({
        resolver: zodResolver(todoSchema),
    });

    const todoContent = form.watch('content');

    const onSubmit = async(data: z.infer<typeof todoSchema>) => {
        setIsLoading(true);

        try {
            const response = await axios.post<apiResponse>(`/api/add-todo`, {
                ...data,
            });

            toast({
                title: response.data.message,
                variant: "default"
            });

            form.reset({...form.getValues(), content: ''});
            
            fetchTodos();
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? 'Failed to add Todo',
                variant: "destructive"
            })
        }finally{
            
            setIsLoading(false);
        }
    }

    const fetchTodos = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(true);

        try {
            const response = await axios.get<apiResponse>('/api/get-todos');

            setTodos(response.data.todos || []);

            if(refresh){
                toast({
                    title: "Refreshed Todos",
                    description: "Showing latest Todos"
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: "Error",
                description: `Error - ${axiosError.response?.data.message}` || "Failed to fetch todos",
                variant: "destructive"
            });
        }
        finally{
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    }, [setIsLoading, setTodos]);
    

    useEffect( ()=> {
        if(!session || !session.user) 
            return;
        fetchTodos();
      },[session, fetchTodos]);

    if(userSessionFetching){
        return <DashboardSkeleton></DashboardSkeleton>
    }

    if(!session || !session.user){
        return <div>Please Login</div>
      }

  return (
    <div className="my-8 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <Separator/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Create New Todo
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your new Todo Here!!"
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
                  Add todo
                </Button>
              )
            }
          </div>
        </form>
      </Form>

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchTodos(true);
        }}
      >
        {
          isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin"/>
          ): (
            <RefreshCcw className="h-4 w-4"/>
          )
        }
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {
          todos.length > 0 ? (
            todos.map((todo, index) => (
              <TodoCard
                key={todo._id.toString()}
                todo={todo}
                onTodoDelete={handleDeleteTodo}
                onTodoUpdate={handleUpdateTodo}
              />
            ))
          ): (
            <p>No Todo to display.</p>
          )
        }
      </div>
    </div>
  )
}

export default Dashboard
