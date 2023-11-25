"use client"

import React from 'react';

import Image from 'next/image';

import { usePathname } from 'next/navigation';
import { signIn,signOut, useSession } from "next-auth/react";

const SideNav = () => {
  const pathname = usePathname();
  const {data}=useSession()
  return (
    <nav className="px-4 py-6 ">
      <div className='sticky top-0'>
      <div className="flex items-center justify-center mb-4">
        <Image src="/twitter.png" height={100} width={100} alt='Logo'/>
      </div>
      <ul className="space-y-2">
        <li className={`${pathname==='/' && 'text-gray-300'} hover:text-gray-300  cursor-pointer`}>Home</li>
        <li onClick={()=>{
    if (data?.expires){
      void signOut({ callbackUrl:process.env.NEXTAUTH_URL })
    }
    else{
      void signIn()
    }
   }} className="hover:text-gray-300 cursor-pointer">{data?.expires?"Log out" : "Log in"}</li>
   
      </ul>
      </div>
    </nav>
  );
};

export default SideNav;
