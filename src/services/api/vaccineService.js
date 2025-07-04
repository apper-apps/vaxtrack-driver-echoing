import vaccineData from '@/services/mockData/vaccines.json'

class VaccineService {
  constructor() {
    this.vaccines = [...vaccineData]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.vaccines]
  }
  
  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const vaccine = this.vaccines.find(v => v.Id === Id)
    if (!vaccine) {
      throw new Error('Vaccine not found')
    }
    return { ...vaccine }
  }
  
  async create(vaccineData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newVaccine = {
      Id: Math.max(...this.vaccines.map(v => v.Id)) + 1,
      ...vaccineData
    }
    
    this.vaccines.push(newVaccine)
    return { ...newVaccine }
  }
  
  async update(Id, vaccineData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.vaccines.findIndex(v => v.Id === Id)
    if (index === -1) {
      throw new Error('Vaccine not found')
    }
    
    this.vaccines[index] = { ...this.vaccines[index], ...vaccineData }
    return { ...this.vaccines[index] }
  }
  
  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.vaccines.findIndex(v => v.Id === Id)
    if (index === -1) {
      throw new Error('Vaccine not found')
    }
    
    this.vaccines.splice(index, 1)
    return true
  }
}

export const vaccineService = new VaccineService()