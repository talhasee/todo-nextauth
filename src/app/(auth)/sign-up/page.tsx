'use client'

import { zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);


    const form = useForm< z.infer<typeof signUpSchema> > ({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });


    const onSubmit = async (data: z.infer<typeof signUpSchema> ) => {
        setIsSubmitting(true);
        
        try {
            const response = await axios.post<apiResponse>(`/api/sign-up`, data);

            toast({
                title: 'Success',
                description: response.data.message
            });
            
            routeToSignInPage();
            
        } catch (error) {
            console.error(`Error in signing up user - ${error}`);
            
            const axiosError = error as AxiosError<apiResponse>;
            let errorMessage = axiosError.response?.data.message;

            toast({
                title: 'Sign-up Failed',
                description: errorMessage,
                variant: "destructive"
            });
        }
        finally{
            setIsSubmitting(false);
        }


    }

    const routeToSignInPage = () => {
        router.replace(`/sign-in`);
    }

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mx-5">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Todo List
            </h1>
            <p className="mb-4">
              Sign up to make your todo list
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={ form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email" 
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email"  
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password" 
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password"  
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                  </>
                ) : ( 'Sign-up' )
              }
            </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">
                Sign-in
              </Link>
            </p>
          </div>
        </div>
    </div>
    )
}

export default SignUp
