import React from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import { ToolBar } from '../../components/ToolBar'

const page = () => {
  return (
   <div className="relative h-screen overflow-hidden">
      <DashboardHeader/>
      <ToolBar />
    </div>
  )
}

export default page
