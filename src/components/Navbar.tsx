'use client'
import { useSession, signOut} from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { User } from "next-auth";
import { Button } from './ui/button';
import { Label } from "@/components/ui/label";

const Navbar = () => {
    const {data: session} = useSession();

  return (
    <nav className='p-4 md:p-6 md:gap-5 shadow-md w-full'>
    <div className="container mx-auto flex flex-row md:flex-row justify-between items-center">
        <a className="text-lg md:text-xl font-bold" href="#">Todo App</a>
        {
            session  ? (
                <>
                    
                    <Button className='w-auto md:w-auto mr-4 ml-2 md:ml-0' onClick={() => signOut()}>Logout</Button>
                    
                </>
            ) : (
                <Link href='/sign-in'>
                    <Button className='w-full md:w-auto'>Login</Button>
                </Link>
            )
        }
    </div>
</nav>
  )
}

export default Navbar
