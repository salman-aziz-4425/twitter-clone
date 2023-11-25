import Image from "next/image";

type TweetProps={
  content:string,
  imagePath:string | null | undefined,
  name:string | null | undefined
}


export function TweetList({content,imagePath,name}:TweetProps){
  return <div
  className="bg-white w-full p-4 rounded-lg shadow-md"
>
  <div className="flex items-center mb-4 py-2 w-full">
    <div className="h-16 w-16">
      <Image
        className="rounded-full"
        src={String(imagePath)}
        height={100}
        width={100}
        alt="User Avatar"
      />
    </div>
    <div className="ml-4">
      <h1 className="text-xl font-bold">{String(name)}</h1>
    </div>
  </div>
  <p className="text-gray-700">{content}</p>
</div>
}