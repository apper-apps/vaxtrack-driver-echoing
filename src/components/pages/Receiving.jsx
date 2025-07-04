import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { vaccineService } from '@/services/api/vaccineService'
import { inventoryService } from '@/services/api/inventoryService'
import { receiptService } from '@/services/api/receiptService'
import { toast } from 'react-toastify'

const Receiving = () => {
  const [vaccines, setVaccines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    vaccineId: '',
    lotNumber: '',
    quantitySent: '',
    quantityReceived: '',
    dosesPassedInspection: '',
    dosesFailedInspection: '',
    discrepancyReason: '',
    expirationDate: '',
    receivedDate: new Date().toISOString().split('T')[0]
  })
  
  const [formErrors, setFormErrors] = useState({})
  
  const loadVaccines = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await vaccineService.getAll()
      setVaccines(data)
    } catch (err) {
      setError('Failed to load vaccine types')
      console.error('Vaccines load error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadVaccines()
  }, [])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Auto-calculate failed inspection doses
    if (name === 'quantityReceived' || name === 'dosesPassedInspection') {
      const received = name === 'quantityReceived' ? parseInt(value) || 0 : parseInt(formData.quantityReceived) || 0
      const passed = name === 'dosesPassedInspection' ? parseInt(value) || 0 : parseInt(formData.dosesPassedInspection) || 0
      const failed = Math.max(0, received - passed)
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        dosesFailedInspection: failed.toString()
      }))
    }
  }
  
  const validateForm = () => {
    const errors = {}
    
    if (!formData.vaccineId) errors.vaccineId = 'Please select a vaccine'
    if (!formData.lotNumber) errors.lotNumber = 'Lot number is required'
    if (!formData.quantitySent) errors.quantitySent = 'Quantity sent is required'
    if (!formData.quantityReceived) errors.quantityReceived = 'Quantity received is required'
    if (!formData.dosesPassedInspection) errors.dosesPassedInspection = 'Passed inspection count is required'
    if (!formData.expirationDate) errors.expirationDate = 'Expiration date is required'
    if (!formData.receivedDate) errors.receivedDate = 'Received date is required'
    
    // Validate quantities
    const sent = parseInt(formData.quantitySent) || 0
    const received = parseInt(formData.quantityReceived) || 0
    const passed = parseInt(formData.dosesPassedInspection) || 0
    
    if (received > sent) {
      errors.quantityReceived = 'Received quantity cannot exceed sent quantity'
    }
    
    if (passed > received) {
      errors.dosesPassedInspection = 'Passed inspection cannot exceed received quantity'
    }
    
    // Validate dates
    const expirationDate = new Date(formData.expirationDate)
    const receivedDate = new Date(formData.receivedDate)
    
    if (expirationDate <= receivedDate) {
      errors.expirationDate = 'Expiration date must be after received date'
    }
    
    // Require discrepancy reason if there's a discrepancy
    if (sent !== received && !formData.discrepancyReason) {
      errors.discrepancyReason = 'Discrepancy reason is required when sent and received quantities differ'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting')
      return
    }
    
    try {
      setSubmitting(true)
      
      // Create receipt record
      const receiptData = {
        vaccineId: formData.vaccineId,
        lotNumber: formData.lotNumber,
        quantitySent: parseInt(formData.quantitySent),
        quantityReceived: parseInt(formData.quantityReceived),
        dosesPassedInspection: parseInt(formData.dosesPassedInspection),
        dosesFailedInspection: parseInt(formData.dosesFailedInspection),
        discrepancyReason: formData.discrepancyReason,
        receivedDate: formData.receivedDate
      }
      
      await receiptService.create(receiptData)
      
      // Create or update inventory record
      const inventoryData = {
        vaccineId: formData.vaccineId,
        lotNumber: formData.lotNumber,
        expirationDate: formData.expirationDate,
        quantityOnHand: parseInt(formData.dosesPassedInspection), // Only passed doses go to inventory
        receivedDate: formData.receivedDate
      }
      
      await inventoryService.create(inventoryData)
      
      toast.success('Vaccine shipment received successfully!')
      
      // Reset form
      setFormData({
        vaccineId: '',
        lotNumber: '',
        quantitySent: '',
        quantityReceived: '',
        dosesPassedInspection: '',
        dosesFailedInspection: '',
        discrepancyReason: '',
        expirationDate: '',
        receivedDate: new Date().toISOString().split('T')[0]
      })
      
    } catch (err) {
      toast.error('Failed to process vaccine receipt')
      console.error('Receipt processing error:', err)
    } finally {
      setSubmitting(false)
    }
  }
  
  const vaccineOptions = vaccines.map(vaccine => ({
    value: vaccine.Id,
    label: `${vaccine.commercialName} (${vaccine.genericName})`
  }))
  
  if (loading) {
    return <Loading variant="form" />
  }
  
  if (error) {
    return (
      <Error 
        title="Loading Error"
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
          <h1 className="section-title">Receive Vaccines</h1>
          <p className="section-subtitle">Record new vaccine shipments and quality inspections</p>
        </div>
      </div>
      
      {/* Receiving Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Shipment Information</h2>
          <p className="text-slate-600 mt-1">Enter details for the vaccine shipment being received</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vaccine Selection */}
            <FormField
              type="select"
              label="Vaccine"
              name="vaccineId"
              value={formData.vaccineId}
              onChange={handleInputChange}
              options={vaccineOptions}
              placeholder="Select vaccine type"
              error={formErrors.vaccineId}
              required
            />
            
            {/* Lot Number */}
            <FormField
              label="Lot Number"
              name="lotNumber"
              value={formData.lotNumber}
              onChange={handleInputChange}
              error={formErrors.lotNumber}
              required
            />
            
            {/* Quantity Sent */}
            <FormField
              label="Quantity Sent"
              name="quantitySent"
              type="number"
              value={formData.quantitySent}
              onChange={handleInputChange}
              error={formErrors.quantitySent}
              min="1"
              required
            />
            
            {/* Quantity Received */}
            <FormField
              label="Quantity Received"
              name="quantityReceived"
              type="number"
              value={formData.quantityReceived}
              onChange={handleInputChange}
              error={formErrors.quantityReceived}
              min="0"
              required
            />
            
            {/* Doses Passed Inspection */}
            <FormField
              label="Doses Passed Inspection"
              name="dosesPassedInspection"
              type="number"
              value={formData.dosesPassedInspection}
              onChange={handleInputChange}
              error={formErrors.dosesPassedInspection}
              min="0"
              required
            />
            
            {/* Doses Failed Inspection (Auto-calculated) */}
            <FormField
              label="Doses Failed Inspection"
              name="dosesFailedInspection"
              type="number"
              value={formData.dosesFailedInspection}
              onChange={handleInputChange}
              min="0"
              disabled
            />
            
            {/* Expiration Date */}
            <FormField
              label="Expiration Date"
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleInputChange}
              error={formErrors.expirationDate}
              required
            />
            
            {/* Received Date */}
            <FormField
              label="Received Date"
              name="receivedDate"
              type="date"
              value={formData.receivedDate}
              onChange={handleInputChange}
              error={formErrors.receivedDate}
              required
            />
          </div>
          
          {/* Discrepancy Reason */}
          <div className="mt-6">
            <label className="form-label">
              Discrepancy Reason
              {(parseInt(formData.quantitySent) || 0) !== (parseInt(formData.quantityReceived) || 0) && (
                <span className="text-error-500 ml-1">*</span>
              )}
            </label>
            <textarea
              name="discrepancyReason"
              value={formData.discrepancyReason}
              onChange={handleInputChange}
              className="form-textarea"
              rows={3}
              placeholder="Explain any discrepancies between sent and received quantities..."
            />
            {formErrors.discrepancyReason && (
              <p className="mt-1 text-sm text-error-600">{formErrors.discrepancyReason}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              icon="Package"
            >
              {submitting ? 'Processing...' : 'Receive Shipment'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default Receiving