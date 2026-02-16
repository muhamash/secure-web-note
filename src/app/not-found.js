import Link from "next/link"

export default function notFoundPage() {
  return (
    <div className=" w-screen h-screen flex flex-col justify-center items-center py-30">
      
          <p className="text-2xl text-center my-10 text-rose-800 font-mono">Not Found</p>
          <Link href={"/"} className="bg-cyan-700 text-white px-5 py-3 my-10 rounded-md text-md shadow-md hover:scale-105 duration-200 transition-all ease-in-out">Back to home</Link>
    </div>
  )
}