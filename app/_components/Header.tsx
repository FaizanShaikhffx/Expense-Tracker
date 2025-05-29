'use client'

import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button';
import {UserButton, useUser} from "@clerk/nextjs";
import Link from 'next/link'

export default function Header() {

  const {user, isSignedIn} = useUser(); 

  return (
    <div className='p-4 flex justify-between items-center border shadow-sm'>
      <Image src={"/logo.svg"} width={160} height={100} alt="logo" />
      {isSignedIn ? <UserButton/> : 
      <Link href={"/sign-in"} >
      <Button>Get Started</Button>
      </Link>
      }
    </div>
  )
}


