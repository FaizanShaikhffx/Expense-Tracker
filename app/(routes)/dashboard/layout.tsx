import React, {ReactNode} from 'react'
import SideNav from './_components/SideNav'

const layout = ({children }: {
  children: ReactNode
}) => {
  return (
    <div>
      <div className='fixed pl-2 md:w-64 hidden md:block'>
        <SideNav/>
      </div>
      <div className='md:ml-64 bg-green-200'>
      {children}
      </div>
    </div>
  )
}

export default layout
