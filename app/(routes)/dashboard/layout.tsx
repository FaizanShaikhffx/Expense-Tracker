import React, {ReactNode} from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'

const layout = ({children }: {
  children: ReactNode
}) => {
  return (
    <div>
      <div className='fixed pl-2 md:w-64 hidden md:block'>
        <SideNav/>
      </div>
      <div className='md:ml-64 '>
        <DashboardHeader/>
      {children}
      </div>
    </div>
  )
}

export default layout
