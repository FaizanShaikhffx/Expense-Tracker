import Image from 'next/image'
import {LayoutGrid, PiggyBank, ReceiptText, ShieldCheck} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
export default function SideNav(){

  const menuList = [
    {
      id: 1, 
      name: "Dashboard",
      icon: LayoutGrid
    }, 
    {
      id: 2, 
      name: "Budget", 
      icon: PiggyBank
    }, 
    {
      id: 3, 
      name: "Expenses",
      icon: ReceiptText
    }, 
    {
      id: 4, 
      name: "Upgrade", 
      icon: ShieldCheck
    }, 
  ]

  return(
    <div className="h-screen p-5 border shadow-sm">
      <Image src={'./logo.svg'}
      alt={"logo"}
      width={160}
      height={100}
      />
      <div className='mt-5'>
        {menuList.map((menu, index)=>(
          <h2 key={index} className='flex gap-2 items-center p-5 cursor-pointer rounded-md text-gray-500 font-medium hover:bg-blue-100 hover:text-indigo-700'>
            <menu.icon/>
            {menu.name}
          </h2>
        ))}
      </div>
      <div className="fixed bottom-10 flex items-center gap-2 p-5">
        <UserButton/>
        Profile
      </div>
    </div>
  )
}
  
