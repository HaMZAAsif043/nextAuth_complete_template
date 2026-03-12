"use client"
import { useRouter } from "next/navigation"


const Navbar = () => {
     const router = useRouter()
     const handleNavigation =(link :string)=>{
 if(!link) return ;
 router.push(link)
     }
     const links =[{
        path:"/",
        name:"Home"
     },{
         path:"/dashboard",
         name:"Dashboard"
     },{
         path:"/login",
         name:"Login"
     }]
  return (
    <div className='w-full h-20 border-b border-zinc-200 bg-white flex justify-between'>
    <div className='text-blue-300 flex items-center justify-start p-5 font-bold w-full'>
        Navbar </div>
          <div className="flex justify-center items-center w-full"> {links.map((link)=>{
              return <div key={link.path} className='px-4 py-2 hover:cursor-pointer' onClick={()=>handleNavigation(link.path)}>{link.name}</div>
        })}
        </div>
      </div>
  )
}

export default Navbar