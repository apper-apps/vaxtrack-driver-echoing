import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import VaccineTable from '@/components/organisms/VaccineTable'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { inventoryService } from '@/services/api/inventoryService'
import { toast } from 'react-toastify'

const Inventory = () => {
  const [vaccines, setVaccines] = useState([])
  const [filteredVaccines, setFilteredVaccines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortField, setSortField] = useState('commercialName')
  const [sortDirection, setSortDirection] = useState('asc')
  
  const loadVaccines = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await inventoryService.getAll()
      setVaccines(data)
      setFilteredVaccines(data)
    } catch (err) {
      setError('Failed to load vaccine inventory')
      console.error('Inventory load error:', err)
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
    
    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(vaccine => {
        const now = new Date()
        const expirationDate = new Date(vaccine.expirationDate)
        const daysToExpiry = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24))
        
        switch (filterStatus) {
          case 'expired':
            return daysToExpiry < 0
          case 'expiring':
            return daysToExpiry >= 0 && daysToExpiry <= 30
          case 'low-stock':
            return vaccine.quantityOnHand <= 10
          case 'ok':
            return daysToExpiry > 30 && vaccine.quantityOnHand > 10
          default:
            return true
        }
      })
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
  }, [vaccines, searchTerm, filterStatus, sortField, sortDirection])
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const handleUpdateQuantity = async (vaccineId, newQuantity) => {
    try {
      const vaccine = vaccines.find(v => v.Id === vaccineId)
      if (!vaccine) return
      
      const updatedVaccine = {
        ...vaccine,
        quantityOnHand: newQuantity
      }
      
      await inventoryService.update(vaccineId, updatedVaccine)
      
      // Update local state
      setVaccines(vaccines.map(v => 
        v.Id === vaccineId ? updatedVaccine : v
      ))
      
      toast.success('Quantity updated successfully')
    } catch (err) {
      toast.error('Failed to update quantity')
      console.error('Update quantity error:', err)
    }
  }
  
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'ok', label: 'OK' },
    { value: 'expiring', label: 'Expiring Soon' },
    { value: 'expired', label: 'Expired' },
    { value: 'low-stock', label: 'Low Stock' }
  ]
  
  if (loading) {
    return <Loading variant="table" />
  }
  
  if (error) {
    return (
      <Error 
        title="Inventory Error"
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
          <h1 className="section-title">Inventory Management</h1>
          <p className="section-subtitle">Track and manage your vaccine inventory</p>
        </div>
        <Button
          variant="primary"
          icon="Download"
          onClick={() => toast.info('Export functionality coming soon')}
        >
          Export Data
        </Button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vaccines, generic names, or lot numbers..."
            className="flex-1"
          />
          
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={statusOptions}
            placeholder="Filter by status"
            className="w-full sm:w-48"
          />
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">{filteredVaccines.length}</div>
          <div className="text-sm text-slate-600">Total Vaccine Lots</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-2xl font-bold text-success-600">
            {filteredVaccines.reduce((sum, v) => sum + v.quantityOnHand, 0)}
          </div>
          <div className="text-sm text-slate-600">Total Doses</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-2xl font-bold text-warning-600">
            {filteredVaccines.filter(v => {
              const now = new Date()
              const expirationDate = new Date(v.expirationDate)
              const daysToExpiry = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24))
              return daysToExpiry >= 0 && daysToExpiry <= 30
            }).length}
          </div>
          <div className="text-sm text-slate-600">Expiring Soon</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-2xl font-bold text-error-600">
            {filteredVaccines.filter(v => new Date(v.expirationDate) < new Date()).length}
          </div>
          <div className="text-sm text-slate-600">Expired</div>
        </div>
      </div>
      
      {/* Vaccine Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Vaccine Inventory</h2>
          <p className="text-slate-600 mt-1">Complete list of all vaccine lots in inventory</p>
        </div>
        
        <div className="p-6">
          {filteredVaccines.length > 0 ? (
            <VaccineTable
              vaccines={filteredVaccines}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ) : (
            <Empty
              title="No Vaccines Found"
              message="No vaccines match your current search and filter criteria."
              icon="Search"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Inventory