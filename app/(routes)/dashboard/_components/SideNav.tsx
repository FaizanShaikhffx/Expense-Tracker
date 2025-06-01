'use client'
import {useEffect} from 'react'
import Image from 'next/image'
import {LayoutGrid, PiggyBank, ReceiptText, ShieldCheck} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import {usePathname} from 'next/navigation'
import Link from 'next/link'

export default function SideNav(){

  const menuList = [
    {
      id: 1, 
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    }, 
    {
      id: 2, 
      name: "Budget", 
      icon: PiggyBank,
      path: "/dashboard/budgets",
    }, 
    {
      id: 3, 
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    } 
    
  ]

  const path = usePathname(); 

  // useEffect(()=>{
  //   console.log(path)
  // }, [])

  return(
    <div className="h-screen p-5 border shadow-sm">
      <Image src="/logo.svg"
      alt={"logo"}
      width={160}
      height={100}
      />
      <div className='mt-5'>
        {menuList.map((menu, index)=>(
          <Link key={index} href={menu.path}>
          <h2  className={`flex gap-2 items-center p-5 mb-2 cursor-pointer rounded-md text-gray-500 font-medium hover:bg-blue-100 hover:text-indigo-700  ${path==menu.path && 'text-indigo-600 bg-blue-100'} `}>
            <menu.icon/>
            {menu.name}
          </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 flex items-center gap-2 p-5">
        <UserButton/>
        Profile
      </div>
    </div>
  )
}
  
