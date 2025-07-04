import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const QuickAction = ({ title, description, icon, onClick, className = '' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`quick-action ${className}`}
      onClick={onClick}
    >
      <div className="quick-action-icon">
        <ApperIcon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="quick-action-title">{title}</h3>
      <p className="quick-action-description">{description}</p>
    </motion.div>
  )
}

export default QuickAction