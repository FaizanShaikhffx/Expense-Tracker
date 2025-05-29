import React, {ReactNode} from 'react'
import SideNav from './_components/SideNav'

const layout = ({children }: {
  children: ReactNode
}) => {
  return (
    <div>
      <div>
        <SideNav/>
      </div>
      <div>
      {children}
      </div>
    </div>
  )
}

export default layout
