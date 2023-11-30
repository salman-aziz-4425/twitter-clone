"use client"

import InfiniteScroll from "react-infinite-scroll-component"
import { TweetList } from "~/app/_components/TweetList"
import { api } from "~/utils/trpc"


export default function Profile({ params }: { params: { slug: string } }){

const sessionData= api.tweet.getProfileInfo.useQuery({id:String(params?.slug[0])})
const {data,fetchNextPage,isLoading,hasNextPage}=api.tweet.getTweet.useInfiniteQuery({userId:params.slug[0],limit:7 },{ getNextPageParam: (lastPage) => lastPage.nextCursor})

  return (
    <div>
         <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center gap-4">
      <h1 className="font-bold text-2xl">Profile</h1>
      </div>
         {!isLoading ?
        data?.pages.map((data,index) => (
      <div  key={index} className="w-full">
        <InfiniteScroll
        key={index}
        dataLength={data.data.length} 
        next={fetchNextPage} 
        hasMore={hasNextPage!}
        loader={<h1>Loading....</h1>}>
         {data?.data?.length>0 ? data?.data?.map((data)=>(
          <div key={data.id} className="border-b">
            {
              !sessionData.isLoading && <TweetList 
              name={sessionData?.data?.name}
              imagePath={sessionData?.data?.image}
              content={data.content}
              />
            }
     
          </div>
        
        
         )):<h1>No Tweets</h1>}
         </InfiniteScroll>
      </div>
        )):<h1 className="text-3xl">Loading.....</h1>}
    </div>

    
  )

}