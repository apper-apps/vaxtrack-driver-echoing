import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import VaccineTable from '@/components/organisms/VaccineTable'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { inventoryService } from '@/services/api/inventoryService'
import { administrationService } from '@/services/api/administrationService'
import { toast } from 'react-toastify'

const Administration = () => {
  const [vaccines, setVaccines] = useState([])
  const [filteredVaccines, setFilteredVaccines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('commercialName')
  const [sortDirection, setSortDirection] = useState('asc')
  
  const loadVaccines = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await inventoryService.getAll()
      // Only show vaccines that have stock and are not expired
      const availableVaccines = data.filter(vaccine => 
        vaccine.quantityOnHand > 0 && 
        new Date(vaccine.expirationDate) > new Date()
      )
      
      setVaccines(availableVaccines)
      setFilteredVaccines(availableVaccines)
    } catch (err) {
      setError('Failed to load vaccine inventory')
      console.error('Administration load error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadVaccines()
  }, [])
  
  // Filter and search logic
  useEffect(() => {
    let filtered = vaccines
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vaccine => 
        vaccine.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccine.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      // Handle date sorting
      if (sortField === 'expirationDate' || sortField === 'receivedDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    setFilteredVaccines(filtered)
  }, [vaccines, searchTerm, sortField, sortDirection])
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const handleRecordAdministration = async (vaccineId, dosesAdministered) => {
    try {
      const vaccine = vaccines.find(v => v.Id === vaccineId)
      if (!vaccine) {
        toast.error('Vaccine not found')
        return
      }
      
      if (dosesAdministered > vaccine.quantityOnHand) {
        toast.error('Cannot administer more doses than available in stock')
        return
      }
      
      if (dosesAdministered <= 0) {
        toast.error('Must administer at least 1 dose')
        return
      }
      
      // Create administration record
      const administrationData = {
        inventoryItemId: vaccineId,
        dosesAdministered: dosesAdministered,
        administrationDate: new Date().toISOString().split('T')[0]
      }
      
      await administrationService.create(administrationData)
      
      // Update inventory
      const updatedVaccine = {
        ...vaccine,
        quantityOnHand: vaccine.quantityOnHand - dosesAdministered
      }
      
      await inventoryService.update(vaccineId, updatedVaccine)
      
      // Update local state
      setVaccines(vaccines.map(v => 
        v.Id === vaccineId ? updatedVaccine : v
      ))
      
      toast.success(`Successfully recorded ${dosesAdministered} administered doses`)
      
    } catch (err) {
      toast.error('Failed to record administration')
      console.error('Administration recording error:', err)
    }
  }
  
  const handleBulkSave = () => {
    toast.info('Bulk save functionality coming soon')
  }
  
  if (loading) {
    return <Loading variant="table" />
  }
  
  if (error) {
    return (
      <Error 
        title="Administration Error"
        message={error}
        onRetry={loadVaccines}
      />
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Record Administration</h1>
          <p className="section-subtitle">Log administered doses and update inventory</p>
        </div>
        <Button
          variant="success"
          icon="Save"
          onClick={handleBulkSave}
        >
          Save All Changes
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search available vaccines..."
            className="flex-1"
          />
          
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>Available vaccines: {filteredVaccines.length}</span>
            <span>•</span>
            <span>Total doses: {filteredVaccines.reduce((sum, v) => sum + v.quantityOnHand, 0)}</span>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Administration Instructions</h3>
            <p className="mt-1 text-sm text-blue-700">
              Click "Record" next to any vaccine to log administered doses. Only vaccines with available stock and valid expiration dates are shown.
            </p>
          </div>
        </div>
      </div>
      
      {/* Administration Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Available Vaccines</h2>
          <p className="text-slate-600 mt-1">Click on any vaccine to record administered doses</p>
        </div>
        
        <div className="p-6">
          {filteredVaccines.length > 0 ? (
            <VaccineTable
              vaccines={filteredVaccines}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onUpdateQuantity={handleRecordAdministration}
              showAdministrationColumn={true}
            />
          ) : (
            <Empty
              title="No Available Vaccines"
              message="No vaccines are currently available for administration. This could be due to empty inventory or expired vaccines."
              icon="Syringe"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Administration