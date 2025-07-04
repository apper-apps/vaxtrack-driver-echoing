import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation()
  
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'BarChart3' },
    { path: '/inventory', label: 'Inventory', icon: 'Package' },
    { path: '/receiving', label: 'Receiving', icon: 'TruckIcon' },
    { path: '/administration', label: 'Administration', icon: 'Syringe' },
    { path: '/reports', label: 'Reports', icon: 'FileText' }
  ]
  
  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        flex items-center px-4 py-3 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }
        ${mobile ? 'w-full' : ''}
      `}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
    >
      <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  )
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:space-x-2">
        {navigationItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute top-full left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 lg:hidden"
        >
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavItem key={item.path} item={item} mobile />
            ))}
          </div>
        </motion.div>
      )}
    </>
  )
}

export default Navigation