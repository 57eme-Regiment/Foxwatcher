import { create } from 'zustand'
import type { InventoryItem, Stock } from '@/types/inventory'

type InventoryState = {
  stocks: Stock[]
  updateQuantity: (stockId: string, itemId: string, delta: number) => void
}

const ICONS = ['IconMountain', 'IconBox', 'IconServer', 'IconCpu', 'IconRadiation', 'IconDroplet', 'IconDeviceComputerCamera', 'IconBolt', 'IconFlask', 'IconStar']
const PREFIXES = ['Iron', 'Copper', 'Steel', 'Titanium', 'Uranium', 'Quantum', 'Plutonium', 'Gold', 'Silver', 'Bronze', 'Polymer', 'Diamond']
const SUFFIXES = ['Ore', 'Ingot', 'Plate', 'Microchip', 'Module', 'Component', 'Fuel', 'Wire', 'Gear', 'Tube']
const CITIES = ['New York', 'Rotterdam', 'Shanghai', 'Singapore', 'Dubai', 'Hamburg', 'Los Angeles']
const STOCK_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Prime']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateItems(count: number): InventoryItem[] {
  return Array.from({ length: count }, (_, i) => {
    const maxCapacity = Math.floor(Math.random() * 90) * 100 + 1000
    const quantity = Math.floor(Math.random() * maxCapacity)
    const demand = Math.floor(Math.random() * maxCapacity * 1.2)

    return {
      id: (i + 1).toString(),
      name: `${pick(PREFIXES)} ${pick(SUFFIXES)}`,
      icon: pick(ICONS),
      quantity,
      maxCapacity,
      demand,
      productionNeed: Math.max(0, demand - quantity),
    }
  })
}

function generateStocks(): Stock[] {
  return CITIES.slice(0, 4).map((city, i) => ({
    id: (i + 1).toString(),
    name: `${STOCK_NAMES[i]} ${i % 2 === 0 ? 'Hub' : 'Base'}`,
    city,
    type: i % 2 === 0 ? 'Seaport' : 'Depot',
    items: generateItems(Math.floor(Math.random() * 50) + 100),
  }))
}

export const useInventoryStore = create<InventoryState>((set) => ({
  stocks: generateStocks(),
  updateQuantity: (stockId, itemId, delta) =>
    set((state) => ({
      stocks: state.stocks.map((stock) => {
        if (stock.id !== stockId) return stock
        return {
          ...stock,
          items: stock.items.map((item) => {
            if (item.id !== itemId) return item
            const quantity = Math.max(0, Math.min(item.maxCapacity, item.quantity + delta))
            return { ...item, quantity, productionNeed: Math.max(0, item.demand - quantity) }
          }),
        }
      }),
    })),
}))
