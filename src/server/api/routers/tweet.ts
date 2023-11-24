import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  getTweet: protectedProcedure
    .input(z.object({ id:z.string() }))
    .query(
      ({ctx,input }) => {
      return ctx.db.tweet.findMany({
        where:{
          userId:input.id
        }
      })
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string(),content:z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.tweet.create({
        data:{
          userId:String(input.name),
          content:input.content
        }
      })
    }),
});
