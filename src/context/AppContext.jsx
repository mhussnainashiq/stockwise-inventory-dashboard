import { createContext, useContext, useReducer, useEffect } from 'react'
import { initialData } from '../data/sampleData'
const AppContext = createContext()
const STORAGE_KEY = 'stockwise_data_v1'
function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw) } catch (e) {}
  return initialData
}
function saveState(state) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (e) {} }
function reducer(state, action) {
  let next = state
  switch (action.type) {
    case 'SET_THEME': next = { ...state, theme: action.payload }; break
    case 'ADD_PRODUCT': next = { ...state, products: [...state.products, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_PRODUCT': next = { ...state, products: state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) }; break
    case 'DELETE_PRODUCT': next = { ...state, products: state.products.filter(p => p.id !== action.payload) }; break
    case 'ADD_CATEGORY': next = { ...state, categories: [...state.categories, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_CATEGORY': next = { ...state, categories: state.categories.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) }; break
    case 'DELETE_CATEGORY': next = { ...state, categories: state.categories.filter(c => c.id !== action.payload) }; break
    case 'ADD_WAREHOUSE': next = { ...state, warehouses: [...state.warehouses, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_WAREHOUSE': next = { ...state, warehouses: state.warehouses.map(w => w.id === action.payload.id ? { ...w, ...action.payload } : w) }; break
    case 'DELETE_WAREHOUSE': next = { ...state, warehouses: state.warehouses.filter(w => w.id !== action.payload) }; break
    case 'ADD_MOVEMENT': {
      const mov = { ...action.payload, id: Date.now().toString() }
      let products = state.products
      if (mov.type === 'in') {
        products = products.map(p => p.id === mov.productId ? { ...p, quantity: p.quantity + mov.quantity } : p)
      } else if (mov.type === 'out') {
        const prod = products.find(p => p.id === mov.productId)
        if (!prod || prod.quantity < mov.quantity) return state // prevent negative
        products = products.map(p => p.id === mov.productId ? { ...p, quantity: p.quantity - mov.quantity } : p)
      }
      next = { ...state, movements: [...state.movements, mov], products }
      break
    }
    case 'ADD_SUPPLIER': next = { ...state, suppliers: [...state.suppliers, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_SUPPLIER': next = { ...state, suppliers: state.suppliers.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) }; break
    case 'DELETE_SUPPLIER': next = { ...state, suppliers: state.suppliers.filter(s => s.id !== action.payload) }; break
    case 'ADD_PO': next = { ...state, purchaseOrders: [...state.purchaseOrders, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_PO': next = { ...state, purchaseOrders: state.purchaseOrders.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) }; break
    case 'RECEIVE_PO': {
      const po = state.purchaseOrders.find(p => p.id === action.payload)
      if (!po || po.status === 'received') return state
      let products = state.products
      let movements = [...state.movements]
      po.items.forEach(item => {
        products = products.map(p => p.id === item.productId ? { ...p, quantity: p.quantity + item.quantity } : p)
        movements.push({ id: Date.now().toString() + Math.random(), productId: item.productId, type: 'in', quantity: item.quantity, warehouseId: po.warehouseId, notes: `PO ${po.number}`, date: new Date().toISOString().slice(0, 10) })
      })
      next = { ...state, products, movements, purchaseOrders: state.purchaseOrders.map(p => p.id === po.id ? { ...p, status: 'received' } : p) }
      break
    }
    case 'RESET_DATA': next = initialData; break
    default: return state
  }
  saveState(next)
  return next
}
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)
  useEffect(() => { document.documentElement.setAttribute('data-theme', state.theme || 'light') }, [state.theme])
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
