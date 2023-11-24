"use client"

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";

export default  function Home() {
  const sessionData=useSession()
  const pathname=usePathname()
  const [content,setContent]=useState("")
   const {data,isLoading}=api.tweet.getTweet.useQuery({id:String(sessionData.data?.user.id)})
  
   console.log(data)

  const createTweet=api.tweet.create.useMutation({
    onSuccess: ()=>{
      console.log("Tweet created")
    }
  })

  return (
    <div className="pl-4">
    <h1>{pathname === '/' ? 'Home' : pathname}</h1>
  
    <div className="h-16 w-16 pt-4 flex items-center gap-4">
      {sessionData.status === 'authenticated' && (
        <Image className="rounded-full" src={String(sessionData?.data.user.image)} height={100} width={100} alt="User Avatar" />
      )}
      {
        sessionData.status === "authenticated" &&  <div className="flex flex-col">
        <h1 className="font-medium text-xl">{sessionData.data?.user.name}</h1>
        <div className="flex gap-2 items-center">
        <form className="mt-2">
          <input
            onChange={(e)=>setContent(String(e.target.value))}
            type="text"
            placeholder="What's happening?"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          />
        </form>
        <button className="p-4 bg-black text-white rounded-md " onClick={()=>createTweet.mutate({name:String(sessionData.data?.user.id),content:String(content)})}>Post</button>
        </div>
      </div>
      }
    </div>
    <div className="flex flex-col items-start gap-4 py-8">
      {
        !isLoading && data?.map((data)=>(
          <h1 key={data.id}>{data.content}</h1>
        ))
      }
      </div>
    
  </div>
  );
}

