import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Navigation = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation()
  
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'BarChart3' },
    { path: '/inventory', label: 'Inventory', icon: 'Package' },
    { path: '/receiving', label: 'Receiving', icon: 'TruckIcon' },
    { path: '/administration', label: 'Administration', icon: 'Syringe' },
    { path: '/reports', label: 'Reports', icon: 'FileText' }
  ]
  
  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        flex items-center px-4 py-3 rounded-lg transition-all duration-200 w-full group
        ${isActive 
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
      onClick={() => setIsSidebarOpen(false)}
    >
      <ApperIcon name={item.icon} className="w-5 h-5 mr-3 flex-shrink-0" />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  )
  
  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => (
        <NavItem key={item.path} item={item} />
      ))}
    </nav>
  )
}

export default Navigation