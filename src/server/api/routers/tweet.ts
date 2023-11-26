import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  getTweet: protectedProcedure
  .input(z.object({ userId:z.string().optional(),limit:z.number().optional(),cursor: z.object({ id: z.string(), createdAt: z.date() }).optional()}))
  .query(async ({ ctx, input }) => {
    const { cursor,limit=6,userId=ctx.session.user.id } = input;
    const data=await ctx.db.tweet.findMany({
      take:limit+1,
      cursor: cursor
        ? {
            id: cursor?.id,
            createdAt: cursor?.createdAt,
          }
        : undefined,
      where: {
        userId: userId,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    const prevCursor=cursor
    let nextCursor=undefined;
    if(data.length>limit){
    const lastData=data.pop()
    if(lastData!=null){
      nextCursor={
        id:lastData?.id,
        createdAt:lastData?.createdAt
      }
    }
  }
    return {
      data,
      nextCursor,
      prevCursor
    }
  }),
  getProfileInfo:protectedProcedure.input(z.object({id:z.string()})).query(({ctx,input})=>{
    console.log("data")
    console.log(input.id)
    const userData=ctx.db.user.findUnique({
      where:{
        id:input.id
      }
    })
    return userData
  }),
  create: protectedProcedure
    .input(z.object({ userId:z.string(),content:z.string()}))
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.tweet.create({
        data:{
          userId:input.userId,
          content:input.content
        }
      })
    }),
});
