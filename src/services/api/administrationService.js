import administrationData from '@/services/mockData/administration.json'

class AdministrationService {
  constructor() {
    this.administrations = [...administrationData]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.administrations]
  }
  
  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const administration = this.administrations.find(a => a.Id === Id)
    if (!administration) {
      throw new Error('Administration record not found')
    }
    return { ...administration }
  }
  
  async create(administrationData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newAdministration = {
      Id: Math.max(...this.administrations.map(a => a.Id)) + 1,
      ...administrationData
    }
    
    this.administrations.push(newAdministration)
    return { ...newAdministration }
  }
  
  async update(Id, administrationData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.administrations.findIndex(a => a.Id === Id)
    if (index === -1) {
      throw new Error('Administration record not found')
    }
    
    this.administrations[index] = { ...this.administrations[index], ...administrationData }
    return { ...this.administrations[index] }
  }
  
  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.administrations.findIndex(a => a.Id === Id)
    if (index === -1) {
      throw new Error('Administration record not found')
    }
    
    this.administrations.splice(index, 1)
    return true
  }
}

export const administrationService = new AdministrationService()