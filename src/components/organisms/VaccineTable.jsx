import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import StatusBadge from '@/components/atoms/StatusBadge'
import Button from '@/components/atoms/Button'
import { format } from 'date-fns'

const VaccineTable = ({ 
  vaccines = [], 
  onSort, 
  sortField, 
  sortDirection, 
  onUpdateQuantity,
  showAdministrationColumn = false,
  className = '' 
}) => {
  const [editingRow, setEditingRow] = useState(null)
  const [editValue, setEditValue] = useState('')
  
  const handleSort = (field) => {
    onSort(field)
  }
  
  const handleEditStart = (vaccine, currentValue) => {
    setEditingRow(vaccine.Id)
    setEditValue(currentValue.toString())
  }
  
  const handleEditSave = (vaccine) => {
    const newQuantity = parseInt(editValue) || 0
    onUpdateQuantity(vaccine.Id, newQuantity)
    setEditingRow(null)
    setEditValue('')
  }
  
  const handleEditCancel = () => {
    setEditingRow(null)
    setEditValue('')
  }
  
  const getVaccineStatus = (vaccine) => {
    const now = new Date()
    const expirationDate = new Date(vaccine.expirationDate)
    const daysToExpiry = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24))
    
    if (daysToExpiry < 0) return 'expired'
    if (daysToExpiry <= 30) return 'expiring'
    if (vaccine.quantityOnHand <= 10) return 'low-stock'
    return 'ok'
  }
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'expired': return 'Expired'
      case 'expiring': return 'Expiring Soon'
      case 'low-stock': return 'Low Stock'
      default: return 'OK'
    }
  }
  
  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <ApperIcon 
            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            className="w-4 h-4"
          />
        )}
      </div>
    </th>
  )
  
  return (
    <div className={`data-table-container ${className}`}>
      <div className="clinical-table">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <SortableHeader field="commercialName">Vaccine Name</SortableHeader>
              <SortableHeader field="genericName">Generic Name</SortableHeader>
              <SortableHeader field="lotNumber">Lot Number</SortableHeader>
              <SortableHeader field="expirationDate">Expiration Date</SortableHeader>
              <SortableHeader field="quantityOnHand">Quantity On Hand</SortableHeader>
              {showAdministrationColumn && (
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Administer Doses
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {vaccines.map((vaccine) => {
              const status = getVaccineStatus(vaccine)
              return (
                <motion.tr
                  key={vaccine.Id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{vaccine.commercialName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                    {vaccine.genericName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-700">
                    {vaccine.lotNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                    {format(new Date(vaccine.expirationDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-slate-900">
                    {vaccine.quantityOnHand}
                  </td>
                  {showAdministrationColumn && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === vaccine.Id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
                            min="0"
                            max={vaccine.quantityOnHand}
                          />
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleEditSave(vaccine)}
                          >
                            <ApperIcon name="Check" className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditCancel}
                          >
                            <ApperIcon name="X" className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart(vaccine, 0)}
                        >
                          <ApperIcon name="Edit" className="w-3 h-3 mr-1" />
                          Record
                        </Button>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={status}>
                      {getStatusLabel(status)}
                    </StatusBadge>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VaccineTable