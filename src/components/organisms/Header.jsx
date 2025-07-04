import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Navigation from '@/components/organisms/Navigation'
import Button from '@/components/atoms/Button'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40"
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Shield" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">VaxTrack Pro</h1>
                <p className="text-xs text-slate-500">Vaccine Inventory Management</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <Navigation 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen} 
          />
          
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
            
            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="sm"
              icon={isMobileMenuOpen ? "X" : "Menu"}
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header