import { create } from "zustand"

export interface Business {
  id: string
  name: string
  startDate: string
  endDate: string
  amountPaid: number
  subscriptionType: "Anual" | "Mensual"
  subscriptionCount: number
}

interface BusinessStore {
  businesses: Business[]
  addBusiness: (business: Omit<Business, "id" | "subscriptionCount">) => void
  getBusinessById: (id: string) => Business | undefined
  getBusinessCount: (name: string) => number
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  businesses: [],

  addBusiness: (businessData) => {
    const { businesses } = get()
    const existingCount = businesses.filter((b) => b.name === businessData.name).length

    const newBusiness: Business = {
      ...businessData,
      id: crypto.randomUUID(),
      subscriptionCount: existingCount + 1,
    }

    set({ businesses: [...businesses, newBusiness] })
  },

  getBusinessById: (id) => {
    const { businesses } = get()
    return businesses.find((b) => b.id === id)
  },

  getBusinessCount: (name) => {
    const { businesses } = get()
    return businesses.filter((b) => b.name === name).length
  },
}))
