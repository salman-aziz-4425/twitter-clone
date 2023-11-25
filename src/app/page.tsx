"use client"

import InfiniteScroll from 'react-infinite-scroll-component';
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { api } from "~/utils/trpc";

import NewTweetForm from "./_components/NewTweetForm";
import { TweetList } from "./_components/TweetList";

export default  function Home() {
  const sessionData=useSession()
  const pathname=usePathname()
   const {data,fetchNextPage,isLoading,hasNextPage}=api.tweet.getTweet.useInfiniteQuery({},{ getNextPageParam: (lastPage) => lastPage.nextCursor,getPreviousPageParam: (firstPage) => firstPage.prevCursor })
   if (sessionData.status!=='authenticated') return
  return (
    <div className="py-2 w-full">
      <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center gap-4">
      <h1 className="font-bold text-2xl">{pathname === '/' ? 'Home' : pathname}</h1>
      <h1 className="font-medium text-xl">{sessionData.data?.user.name}</h1>
      </div>
    
  <NewTweetForm />

    <div className="flex flex-col w-full items-start gap-4 px-4 py-2">
      {!isLoading ?
        data?.pages.map((data,index) => (
      <div  key={index} className="w-full">
        <InfiniteScroll 
        inverse
        key={index}
        dataLength={data.data.length} 
        next={fetchNextPage} 
        hasMore={hasNextPage!}
        loader={<h1>Loading....</h1>}>
         {data?.data.length>0 ? data.data.map((data)=>(
          <div key={data.id} className="border-b">
         <TweetList 
          name={sessionData?.data?.user.name}
          imagePath={sessionData?.data?.user.image}
          content={data.content}
          />
          </div>
        
        
         )):<h1>No Tweets</h1>}
         </InfiniteScroll>
      </div>
        )):<h1 className="text-3xl">Loading.....</h1>}
    </div>
    
  </div>
  );
}

