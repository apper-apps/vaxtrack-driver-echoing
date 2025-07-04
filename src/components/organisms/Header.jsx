import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30"
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button + Page title */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              icon="Menu"
              className="lg:hidden mr-4"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="lg:hidden">
              <h1 className="text-lg font-bold text-slate-900">VaxTrack Pro</h1>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              icon="Bell"
              className="hidden sm:flex"
            >
              Alerts
            </Button>
            
            {/* User menu placeholder */}
            <Button
              variant="outline"
              size="sm"
              icon="User"
              className="hidden sm:flex"
            >
              Profile
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header